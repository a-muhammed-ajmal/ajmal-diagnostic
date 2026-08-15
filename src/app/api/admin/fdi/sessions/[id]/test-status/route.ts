import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthContext } from '@/lib/adminAuth';
import { FdiInputError, setFdiTestStatus } from '@/lib/fdi-server/persistence';
import { fdiTestStatusSchema } from '@/lib/fdi-server/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminAuthContext();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });

  try {
    const { id } = await params;
    const body = fdiTestStatusSchema.parse(await request.json());
    await setFdiTestStatus(id, body.isTest, admin.identifier, body.reason);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof FdiInputError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error('FDI test status update failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to change FDI test status.' }, { status: 500 });
  }
}
