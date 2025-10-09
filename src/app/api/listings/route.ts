import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(listings);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    const { type, name, price, description, brand, model, year, mileage, sailing_hours, condition } = await request.json();
    const newListing = await prisma.listing.create({
      data: { 
        type, 
        name, 
        price, 
        description,
        brand,
        model,
        year,
        mileage,
        sailing_hours,
        condition
      },
    });
    return NextResponse.json(newListing, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}