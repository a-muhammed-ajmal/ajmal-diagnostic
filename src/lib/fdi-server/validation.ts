import { z } from 'zod';

export const fdiAnswerMapSchema = z.record(z.string().min(1), z.string().min(1)).refine(
  (answers) => Object.keys(answers).length > 0,
  'At least one answer is required.',
);

const sectorSchema = z.string().trim().min(1).max(100);

export const fdiQualificationPatchSchema = z.object({
  country: z.enum(['uae', 'other']).optional(),
  founderLed: z.boolean().optional(),
  annualRevenue: z.enum(['under_1m', 'aed_1m_to_10m', 'over_10m']).optional(),
  employeeCount: z.enum(['under_5', 'employees_5_to_50', 'over_50']).optional(),
  operatingYears: z.enum(['under_3', 'years_3_or_more']).optional(),
  singleDecisionAuthority: z.boolean().optional(),
  willingToShareOperationalInformation: z.boolean().optional(),
  primarySector: sectorSchema.optional(),
  secondarySector: z.string().trim().max(100).optional(),
  otherSector: z.string().trim().max(100).optional(),
}).strict();

export const fdiQualificationSchema = fdiQualificationPatchSchema.refine(
  (value) =>
    value.country !== undefined &&
    value.founderLed !== undefined &&
    value.annualRevenue !== undefined &&
    value.employeeCount !== undefined &&
    value.operatingYears !== undefined &&
    value.singleDecisionAuthority !== undefined &&
    value.willingToShareOperationalInformation !== undefined &&
    value.primarySector !== undefined,
  'All qualification responses are required before completion.',
);

export const fdiContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320),
  companyName: z.string().trim().min(2).max(200),
  phone: z.string().trim().max(50).optional(),
}).strict();

export const fdiStartSchema = z.object({
  testMode: z.boolean().optional().default(false),
}).strict();

export const fdiPatchSchema = z.object({
  sessionToken: z.string().min(20).max(200),
  answers: fdiAnswerMapSchema.optional(),
  qualification: fdiQualificationPatchSchema.optional(),
  completionMs: z.number().int().nonnegative().max(86_400_000).optional(),
}).strict().refine(
  (value) => value.answers !== undefined || value.qualification !== undefined || value.completionMs !== undefined,
  'At least one progressive update is required.',
);

export const fdiSubmitSchema = z.object({
  sessionId: z.string().uuid(),
  sessionToken: z.string().min(20).max(200),
  contact: fdiContactSchema,
  completionMs: z.number().int().nonnegative().max(86_400_000).optional(),
}).strict();

export const fdiTestStatusSchema = z.object({
  isTest: z.boolean(),
  reason: z.string().trim().min(3).max(500).optional(),
}).strict();

export type FdiQualificationPatch = z.infer<typeof fdiQualificationPatchSchema>;
export type FdiQualificationValues = z.infer<typeof fdiQualificationSchema>;
export type FdiContact = z.infer<typeof fdiContactSchema>;
