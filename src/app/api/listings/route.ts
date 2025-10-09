import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { parseForm, getPublicPaths } from '@/lib/upload';

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
    const { fields, files } = await parseForm(request);

    const { type, name, price, description, brand, model, year, mileage, sailing_hours, condition } = fields;

    const imagePaths = getPublicPaths(files.images);
    const videoPaths = getPublicPaths(files.videos);

    const newListing = await prisma.listing.create({
      data: { 
        type: Array.isArray(type) ? type[0] : type,
        name: Array.isArray(name) ? name[0] : name,
        price: parseFloat(Array.isArray(price) ? price[0] : price),
        description: Array.isArray(description) ? description[0] : description,
        brand: Array.isArray(brand) ? brand[0] : brand,
        model: Array.isArray(model) ? model[0] : model,
        year: year && year[0] ? parseInt(year[0]) : null,
        mileage: mileage && mileage[0] ? parseInt(mileage[0]) : null,
        sailing_hours: sailing_hours && sailing_hours[0] ? parseInt(sailing_hours[0]) : null,
        condition: Array.isArray(condition) ? condition[0] : condition,
        images: imagePaths,
        videos: videoPaths,
      },
    });
    return NextResponse.json(newListing, { status: 201 });
  } catch (err: any) {
    console.error("Error creating listing:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}