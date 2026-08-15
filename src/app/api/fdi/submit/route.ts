import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { FdiReportEmail } from '@/lib/email/templates/FdiReport';
import { CALENDLY_LINK } from '@/lib/env';
import { isFdiEnabled } from '@/lib/featureFlags';
import { completeFdiSession, FdiInputError, FdiSessionConflictError } from '@/lib/fdi-server/persistence';
import { toFounderFdiReport } from '@/lib/fdi/public-report';
import { hasValidFdiSessionToken } from '@/lib/fdi-server/session-token';
import { fdiSubmitSchema } from '@/lib/fdi-server/validation';
import { enforcePublicFormLimits } from '@/lib/rateLimit';
import { requireResendConfig } from '@/lib/serverEnv';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const RESEND_CONFIG = requireResendConfig();

export async function POST(request: NextRequest) {
  if (!isFdiEnabled()) return new NextResponse(null, { status: 404 });

  try {
    const body = fdiSubmitSchema.parse(await request.json());
    if (!hasValidFdiSessionToken(body.sessionId, body.sessionToken)) {
      return NextResponse.json({ success: false, error: 'Invalid diagnostic session.' }, { status: 403 });
    }
    const limited = await enforcePublicFormLimits(request, 'fdi-submit', body.contact.email);
    if (limited) return limited;

    const report = await completeFdiSession(body.sessionId, body.contact, body.completionMs);
    const founderReport = toFounderFdiReport(report);
    let emailSent = false;
    try {
      const resend = new Resend(RESEND_CONFIG.apiKey);
      const { data, error } = await resend.emails.send({
        from: `Muhammed Ajmal Consulting <${RESEND_CONFIG.fromEmail}>`,
        to: body.contact.email,
        subject: `Your ${report.index.presentation}`,
        react: FdiReportEmail({
          name: body.contact.name,
          companyName: body.contact.companyName,
          report: founderReport,
          calendlyLink: CALENDLY_LINK,
        }),
      });
      if (error) {
        console.error(`Resend rejected FDI report for session ${body.sessionId} (from ${RESEND_CONFIG.fromEmail}):`, error);
      } else {
        const { error: updateError } = await createAdminClient()
          .from('fdi_sessions')
          .update({ email_sent: true })
          .eq('id', body.sessionId)
          .eq('status', 'completed');
        if (updateError) console.error(`FDI email acceptance could not be recorded for session ${body.sessionId}:`, updateError);
        else {
          emailSent = true;
          console.info(`FDI report accepted by Resend for session ${body.sessionId}`, { messageId: data?.id });
        }
      }
    } catch (error) {
      console.error(`FDI report send threw for session ${body.sessionId}:`, error);
    }

    return NextResponse.json({ success: true, report: founderReport, emailSent });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof FdiInputError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    if (error instanceof FdiSessionConflictError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }
    console.error('FDI submit failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to complete the diagnostic. Please try again.' }, { status: 500 });
  }
}
