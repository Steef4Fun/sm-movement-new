import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteConfirmation } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    let whereClause: any = {};
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (session.role !== 'admin') {
      whereClause.user_id = session.id;
    } else if (userId) {
      whereClause.user_id = userId;
    }

    const quotes = await prisma.quote.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (err: any) {
    return NextResponse.json({ message: 'Serverfout' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    const { customer_email, subject, amount, description } = await request.json();
    
    let user = await prisma.user.findUnique({ where: { email: customer_email } });
    let isGuest = false;
    let activationToken: string | null = null;

    if (!user) {
      isGuest = true;
      const salt = await bcrypt.genSalt(10);
      const tempPassword = `guest_${Date.now()}_${Math.random()}`;
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      activationToken = crypto.randomBytes(32).toString('hex');
      const activationTokenExpires = new Date(Date.now() + 3600000 * 24); // 24 hours

      user = await prisma.user.create({
        data: {
          email: customer_email,
          role: 'klant',
          first_name: 'Nieuwe',
          last_name: 'Klant',
          password_hash: hashedPassword,
          activation_token: activationToken,
          activation_token_expires: activationTokenExpires,
        },
      });
    }

    const newQuote = await prisma.quote.create({
      data: { user_id: user.id, subject, amount, description },
    });

    sendQuoteConfirmation({
      email: user.email,
      firstName: user.first_name,
      subject: newQuote.subject,
      amount: newQuote.amount,
      description: newQuote.description,
      isGuest,
      activationToken,
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (err: any) {
    console.error("Error creating quote:", err);
    return NextResponse.json({ message: 'Serverfout bij aanmaken offerte.' }, { status: 500 });
  }
}