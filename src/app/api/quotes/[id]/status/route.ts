import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    if (status !== 'geaccepteerd' && status !== 'geweigerd') {
      return NextResponse.json({ message: 'Ongeldige status' }, { status: 400 });
    }

    const quote = await prisma.quote.findFirst({
      where: { id: params.id, user_id: session.id },
    });

    if (!quote) {
      return NextResponse.json({ message: 'Offerte niet gevonden of geen toegang.' }, { status: 404 });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json(updatedQuote);
  } catch (err: any) {
    return NextResponse.json({ message: 'Serverfout' }, { status: 500 });
  }
}