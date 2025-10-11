import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, first_name, last_name, password } = await request.json();

    if (!token || !first_name || !last_name || !password) {
      return NextResponse.json({ message: "Alle velden zijn verplicht." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        activation_token: token,
        activation_token_expires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Activatie link is ongeldig of verlopen." }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        first_name,
        last_name,
        password_hash: hashedPassword,
        activation_token: null,
        activation_token_expires: null,
      },
    });

    return NextResponse.json({ message: "Account succesvol geactiveerd." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Serverfout bij accountactivatie." }, { status: 500 });
  }
}