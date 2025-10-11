import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    const { service_type, requested_date, notes } = await request.json();
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { service_type, requested_date, notes },
    });
    return NextResponse.json(updatedAppointment);
  } catch (err: any) {
    return NextResponse.json({ message: 'Serverfout' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    await prisma.appointment.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ message: 'Serverfout' }, { status: 500 });
  }
}