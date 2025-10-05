import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ message: "Alle velden zijn verplicht." }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        first_name,
        last_name,
      },
    });

    return NextResponse.json({ message: "Registratie succesvol." }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "E-mailadres is al in gebruik." }, { status: 409 });
    }
    return NextResponse.json({ message: "Serverfout bij registratie." }, { status: 500 });
  }
}