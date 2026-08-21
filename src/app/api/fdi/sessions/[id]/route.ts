import { NextRequest, NextResponse } from 'next/server';
import { FdiInputError, FdiSessionConflictError, persistFdiProgress } from '@/lib/fdi-server/persistence';
import { hasValidFdiSessionToken } from '@/lib/fdi-server/session-token';
import { fdiPatchSchema } from '@/lib/fdi-server/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = fdiPatchSchema.parse(await request.json());
    if (!hasValidFdiSessionToken(id, body.sessionToken)) {
      return NextResponse.json({ success: false, error: 'Invalid diagnostic session.' }, { status: 403 });
    }
    await persistFdiProgress(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof FdiInputError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    if (error instanceof FdiSessionConflictError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }
    console.error('FDI session progress save failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to save progress. Please try again.' }, { status: 500 });
  }
}
