import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentConfirmation } from '@/lib/mail';
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

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(appointments);
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
    const { customer_email, service_type, requested_date, notes } = await request.json();
    
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

    const newAppointment = await prisma.appointment.create({
      data: { user_id: user.id, service_type, requested_date, notes },
    });

    sendAppointmentConfirmation({
      email: user.email,
      firstName: user.first_name,
      serviceType: newAppointment.service_type,
      requestedDate: newAppointment.requested_date.toISOString(),
      notes: newAppointment.notes,
      isGuest,
      activationToken,
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (err: any) {
    console.error("Error creating appointment:", err);
    return NextResponse.json({ message: 'Serverfout bij aanmaken afspraak.' }, { status: 500 });
  }
}