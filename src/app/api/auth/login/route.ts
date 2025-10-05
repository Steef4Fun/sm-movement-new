import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
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

    const secret = process.env.JWT_SECRET;
    const expiresInEnv = process.env.JWT_EXPIRES_IN;

    if (!secret || !expiresInEnv) {
      throw new Error("JWT secret or expiration not configured.");
    }

    // The type checker expects a number for expiresIn (seconds).
    // We parse the environment variable string to a number.
    const expiresIn = parseInt(expiresInEnv, 10);

    const options: SignOptions = {
      expiresIn: expiresIn,
    };

    const token = jwt.sign(payload, secret, options);

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Serverfout bij inloggen." }, { status: 500 });
  }
}