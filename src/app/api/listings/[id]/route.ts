import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { saveFiles, deleteFile } from '@/lib/upload';

export const maxDuration = 60; // 60 seconds

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
    const existingListing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!existingListing) {
      return NextResponse.json({ message: 'Item niet gevonden.' }, { status: 404 });
    }

    const formData = await request.formData();
    
    const type = formData.get('type') as string;
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string | null;
    const status = formData.get('status') as string;
    const brand = formData.get('brand') as string | null;
    const model = formData.get('model') as string | null;
    const year = formData.get('year') as string | null;
    const mileage = formData.get('mileage') as string | null;
    const sailing_hours = formData.get('sailing_hours') as string | null;
    const condition = formData.get('condition') as string;

    const existingImages = formData.getAll('existingImages') as string[];
    const existingVideos = formData.getAll('existingVideos') as string[];
    
    const newImages = formData.getAll('images').filter((val): val is File => val instanceof File);
    const newVideos = formData.getAll('videos').filter((val): val is File => val instanceof File);

    if (!type || !name || !price) {
      return NextResponse.json({ message: 'Type, naam en prijs zijn verplichte velden.' }, { status: 400 });
    }

    const newImagePaths = await saveFiles(newImages);
    const newVideoPaths = await saveFiles(newVideos);

    const finalImagePaths = [...existingImages, ...newImagePaths];
    const finalVideoPaths = [...existingVideos, ...newVideoPaths];

    // Delete files that were removed
    const imagesToDelete = existingListing.images.filter(img => !finalImagePaths.includes(img));
    const videosToDelete = existingListing.videos.filter(vid => !finalVideoPaths.includes(vid));
    await Promise.all([...imagesToDelete.map(deleteFile), ...videosToDelete.map(deleteFile)]);

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { 
        type,
        name,
        price: parseFloat(price),
        description,
        status,
        brand,
        model,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        sailing_hours: sailing_hours ? parseInt(sailing_hours) : null,
        condition,
        images: finalImagePaths,
        videos: finalVideoPaths,
      },
    });
    return NextResponse.json(updatedListing);
  } catch (err: any) {
    console.error("Error updating listing:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ message: 'Toegang geweigerd' }, { status: 403 });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (listing) {
      // Delete all associated files
      await Promise.all([...listing.images.map(deleteFile), ...listing.videos.map(deleteFile)]);
    }
    await prisma.listing.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}