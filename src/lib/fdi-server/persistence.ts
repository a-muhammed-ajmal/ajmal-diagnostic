import { createAdminClient } from '@/lib/supabase/server';
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from '@/lib/fdi/config';
import { buildReport } from '@/lib/fdi/report';
import { evaluateQualification } from '@/lib/fdi/qualification';
import { scoreFdi } from '@/lib/fdi/score';
import type { FdiReport, Question } from '@/lib/fdi/types';
import { businessDetailColumns, businessDetailsFromColumns, mergeBusinessDetails, type BusinessDetailRow } from './business-details';
import type { FdiBusinessDetails, FdiContact } from './validation';

type PersistedSession = BusinessDetailRow & {
  id: string;
  status: 'in_progress' | 'completed';
  is_test: boolean;
};

type PersistedAnswer = {
  question_id: string;
  option_id: string;
  change_count: number;
};

export class FdiInputError extends Error {}
export class FdiSessionConflictError extends Error {}

const questionsById = new Map<string, Question>(FDI_1_0_QUESTIONS.questions.map((question) => [question.id, question]));

function resolveAnswer(questionId: string, optionId: string) {
  const question = questionsById.get(questionId);
  if (!question) throw new FdiInputError(`Unknown FDI question: ${questionId}`);
  const option = question.options.find((candidate) => candidate.id === optionId);
  if (!option) throw new FdiInputError(`Invalid option for ${questionId}`);
  return { question, option };
}

export async function startFdiSession(isTest: boolean): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('fdi_sessions')
    .insert({
      status: 'in_progress',
      instrument: FDI_1_0_CONFIG.instrument,
      diagnostic_version: FDI_1_0_CONFIG.diagnosticVersion,
      question_set_version: FDI_1_0_CONFIG.questionSetVersion,
      scoring_model_version: FDI_1_0_CONFIG.scoringModelVersion,
      band_config_version: FDI_1_0_CONFIG.bandConfigVersion,
      is_test: isTest,
    })
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('FDI session could not be created.');
  return data as { id: string };
}

export async function persistFdiProgress(
  sessionId: string,
  update: { answers?: Record<string, string>; completionMs?: number },
): Promise<void> {
  const supabase = createAdminClient();
  const { data: session, error: sessionError } = await supabase
    .from('fdi_sessions')
    .select('id,status')
    .eq('id', sessionId)
    .single();
  if (sessionError || !session) throw new FdiInputError('FDI session was not found.');
  if (session.status !== 'in_progress') throw new FdiSessionConflictError('This FDI session is already complete.');

  if (update.answers) {
    const resolved = Object.entries(update.answers).map(([questionId, optionId]) => ({ questionId, optionId, ...resolveAnswer(questionId, optionId) }));
    const questionIds = resolved.map((answer) => answer.questionId);
    const { data: existingRows, error: existingError } = await supabase
      .from('fdi_answers')
      .select('question_id,option_id,change_count')
      .eq('session_id', sessionId)
      .in('question_id', questionIds);
    if (existingError) throw existingError;
    const existing = new Map((existingRows ?? []).map((row) => [row.question_id, row as PersistedAnswer]));
    const now = new Date().toISOString();
    const rows = resolved
      .filter(({ questionId, optionId }) => existing.get(questionId)?.option_id !== optionId)
      .map(({ question, option, questionId }) => ({
        session_id: sessionId,
        question_id: questionId,
        component_key: question.componentKey,
        option_id: option.id,
        score: option.score,
        answered_at: now,
        change_count: (existing.get(questionId)?.change_count ?? -1) + 1,
      }));
    if (rows.length > 0) {
      const { error } = await supabase
        .from('fdi_answers')
        .upsert(rows, { onConflict: 'session_id,question_id' });
      if (error) throw error;
    }
  }

  const sessionUpdate: Record<string, unknown> = {};
  if (update.completionMs !== undefined) sessionUpdate.completion_ms = update.completionMs;
  if (Object.keys(sessionUpdate).length > 0) {
    const { error } = await supabase
      .from('fdi_sessions')
      .update(sessionUpdate)
      .eq('id', sessionId)
      .eq('status', 'in_progress');
    if (error) throw error;
  }
}

function analysisFor(answers: readonly { score: number }[], completionMs: number | null): Record<string, unknown> {
  const firstScore = answers[0]?.score;
  const straightLine = firstScore !== undefined && answers.every((answer) => answer.score === firstScore);
  return {
    straight_line_flag: straightLine,
    analysis_flags: {
      straightLine,
      completionMs,
      note: 'Quality signals are for consultant review only and never affect the FDI.',
    },
  };
}

export async function completeFdiSession(
  sessionId: string,
  contact: FdiContact,
  completionMs?: number,
  businessDetails?: FdiBusinessDetails,
): Promise<FdiReport> {
  const supabase = createAdminClient();
  const { data: sessionData, error: sessionError } = await supabase
    .from('fdi_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (sessionError || !sessionData) throw new FdiInputError('FDI session was not found.');
  const session = sessionData as PersistedSession & { completion_ms: number | null };
  if (session.status !== 'in_progress') throw new FdiSessionConflictError('This FDI session is already complete.');

  const { data: answerRows, error: answerError } = await supabase
    .from('fdi_answers')
    .select('question_id,option_id,score,change_count')
    .eq('session_id', sessionId);
  if (answerError) throw answerError;
  const answers = Object.fromEntries((answerRows ?? []).map((row) => [row.question_id, row.option_id]));
  const scored = scoreFdi(
    { diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers },
    FDI_1_0_CONFIG,
    FDI_1_0_QUESTIONS,
  );
  if (!scored.ok) throw new FdiInputError('All twelve FDI answers are required before completion.');

  // Business details are optional: whatever is missing stays missing, and the
  // qualification outcome absorbs that rather than blocking completion.
  const details = mergeBusinessDetails(businessDetailsFromColumns(session), businessDetails);
  const qualification = evaluateQualification(details);
  const completedAt = new Date().toISOString();
  const report = buildReport(scored.result, FDI_1_0_CONFIG, {
    sessionId,
    completedAt,
    qualification,
    ai: null,
  });
  const components = new Map(report.components.map((component) => [component.key, component]));
  const totalChanges = (answerRows ?? []).reduce((sum, answer) => sum + Number(answer.change_count ?? 0), 0);
  const persistedCompletionMs = completionMs ?? session.completion_ms;
  const { error: updateError, count } = await supabase
    .from('fdi_sessions')
    .update({
      status: 'completed',
      completed_at: completedAt,
      name: contact.name,
      email: contact.email.toLowerCase(),
      phone: contact.phone,
      company_name: contact.companyName,
      ...businessDetailColumns(details),
      qualification_config_version: qualification.version,
      qualification_result: qualification.result,
      qualification_reasons: qualification.reasons,
      raw_ds: components.get('DS')?.raw,
      raw_ec: components.get('EC')?.raw,
      raw_ov: components.get('OV')?.raw,
      component_ds: components.get('DS')?.unrounded,
      component_ec: components.get('EC')?.unrounded,
      component_ov: components.get('OV')?.unrounded,
      display_ds: components.get('DS')?.display,
      display_ec: components.get('EC')?.display,
      display_ov: components.get('OV')?.display,
      fdi_unrounded: report.index.unrounded,
      fdi_display: report.index.display,
      band_key: report.index.band.key,
      band_label: report.index.band.label,
      component_alerts: report.alerts,
      concentration: report.concentration,
      observations: report.observations,
      completion_ms: persistedCompletionMs,
      answer_change_count: totalChanges,
      ...analysisFor(scored.result.answers, persistedCompletionMs),
    }, { count: 'exact' })
    .eq('id', sessionId)
    .eq('status', 'in_progress');
  if (updateError) throw updateError;
  if (count !== null && count !== 1) throw new FdiSessionConflictError('This FDI session was completed elsewhere.');

  return report;
}

export async function setFdiTestStatus(
  sessionId: string,
  isTest: boolean,
  adminIdentifier: string,
  reason?: string,
): Promise<void> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('fdi_sessions')
    .select('is_test')
    .eq('id', sessionId)
    .single();
  if (error || !data) throw new FdiInputError('FDI session was not found.');
  if (Boolean(data.is_test) === isTest) return;

  const { error: updateError } = await supabase
    .from('fdi_sessions')
    .update({ is_test: isTest })
    .eq('id', sessionId);
  if (updateError) throw updateError;
  const { error: historyError } = await supabase
    .from('fdi_test_status_history')
    .insert({
      session_id: sessionId,
      previous_is_test: Boolean(data.is_test),
      new_is_test: isTest,
      admin_identifier: adminIdentifier,
      reason: reason ?? null,
    });
  if (historyError) throw historyError;
}
