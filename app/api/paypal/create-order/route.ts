import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Paid plans are not available during early access.' },
    { status: 410 }
  );
}
