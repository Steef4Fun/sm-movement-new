import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    });
    if (!listing) return NextResponse.json({ message: 'Item niet gevonden.' }, { status: 404 });
    return NextResponse.json(listing);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    const { type, name, price, description, status, brand, model, year, mileage, sailing_hours } = await request.json();
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { 
        type, 
        name, 
        price, 
        description, 
        status,
        brand,
        model,
        year,
        mileage,
        sailing_hours
      },
    });
    return NextResponse.json(updatedListing);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    await prisma.listing.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}