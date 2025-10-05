import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("PROFILE API: Request received.");
  const session = await getSession(request);
  if (!session) {
    console.log("PROFILE API: No session found, unauthorized.");
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }
  console.log("PROFILE API: Session found for user:", session.id);

  try {
    console.log("PROFILE API: Attempting to fetch user from database...");
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });

    if (!user) {
      console.log("PROFILE API: User not found in database.");
      return NextResponse.json({ message: 'Gebruiker niet gevonden.' }, { status: 404 });
    }
    
    console.log("PROFILE API: Successfully fetched user.");
    return NextResponse.json(user);
  } catch (err: any) {
    console.error("PROFILE API ERROR:", err); // Log the full error on the server
    // Return a detailed error message to the client for debugging
    return NextResponse.json(
      { 
        message: "Er is een serverfout opgetreden bij het ophalen van het profiel.",
        error: err.message,
        errorCode: err.code, // Include Prisma error code if available
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const { first_name, last_name } = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { first_name, last_name },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (err: any)
  {
    console.error("PROFILE UPDATE API ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}