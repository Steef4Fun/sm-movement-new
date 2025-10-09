import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { saveFiles } from '@/lib/upload';

export const maxDuration = 60; // 60 seconds

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
    const formData = await request.formData();

    const type = formData.get('type') as string;
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string | null;
    const brand = formData.get('brand') as string | null;
    const model = formData.get('model') as string | null;
    const year = formData.get('year') as string | null;
    const mileage = formData.get('mileage') as string | null;
    const sailing_hours = formData.get('sailing_hours') as string | null;
    const condition = formData.get('condition') as string;

    const images = formData.getAll('images').filter((val): val is File => val instanceof File);
    const videos = formData.getAll('videos').filter((val): val is File => val instanceof File);

    if (!type || !name || !price) {
      return NextResponse.json({ message: 'Type, naam en prijs zijn verplichte velden.' }, { status: 400 });
    }

    const imagePaths = await saveFiles(images);
    const videoPaths = await saveFiles(videos);

    const newListing = await prisma.listing.create({
      data: { 
        type,
        name,
        price: parseFloat(price),
        description,
        brand,
        model,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        sailing_hours: sailing_hours ? parseInt(sailing_hours) : null,
        condition,
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