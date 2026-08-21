import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthContext } from '@/lib/adminAuth';
import { startFdiSession } from '@/lib/fdi-server/persistence';
import { issueFdiSessionToken } from '@/lib/fdi-server/session-token';
import { fdiStartSchema } from '@/lib/fdi-server/validation';
import { enforcePublicFormLimits } from '@/lib/rateLimit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = fdiStartSchema.parse(await request.json());
    const limited = await enforcePublicFormLimits(request, 'fdi-start');
    if (limited) return limited;

    let isTest = false;
    if (body.testMode) {
      const admin = await getAdminAuthContext();
      if (!admin) return NextResponse.json({ success: false, error: 'Admin Test Mode is required.' }, { status: 403 });
      isTest = true;
    }

    const session = await startFdiSession(isTest);
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionToken: issueFdiSessionToken(session.id),
      isTest,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid session request.' }, { status: 400 });
    }
    console.error('FDI session start failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to start the diagnostic. Please try again.' }, { status: 500 });
  }
}
