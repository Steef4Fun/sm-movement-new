import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "E-mail en wachtwoord zijn verplicht." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Ongeldige inloggegevens." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: "Ongeldige inloggegevens." }, { status: 401 });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw new Error("JWT secret or expiration not configured.");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Serverfout bij inloggen." }, { status: 500 });
  }
}