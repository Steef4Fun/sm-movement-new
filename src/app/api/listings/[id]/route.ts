import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { parseForm, getPublicPaths, deleteFile } from '@/lib/upload';

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

    const { fields, files } = await parseForm(request);
    const { type, name, price, description, status, brand, model, year, mileage, sailing_hours, condition, existingImages, existingVideos } = fields;

    const newImagePaths = getPublicPaths(files.images);
    const newVideoPaths = getPublicPaths(files.videos);

    const finalImagePaths = [...(Array.isArray(existingImages) ? existingImages : existingImages ? [existingImages] : []), ...newImagePaths];
    const finalVideoPaths = [...(Array.isArray(existingVideos) ? existingVideos : existingVideos ? [existingVideos] : []), ...newVideoPaths];

    // Delete files that were removed
    const imagesToDelete = existingListing.images.filter(img => !finalImagePaths.includes(img));
    const videosToDelete = existingListing.videos.filter(vid => !finalVideoPaths.includes(vid));
    await Promise.all([...imagesToDelete.map(deleteFile), ...videosToDelete.map(deleteFile)]);

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { 
        type: Array.isArray(type) ? type[0] : type,
        name: Array.isArray(name) ? name[0] : name,
        price: parseFloat(Array.isArray(price) ? price[0] : price),
        description: Array.isArray(description) ? description[0] : description,
        status: Array.isArray(status) ? status[0] : status,
        brand: Array.isArray(brand) ? brand[0] : brand,
        model: Array.isArray(model) ? model[0] : model,
        year: year && year[0] ? parseInt(year[0]) : null,
        mileage: mileage && mileage[0] ? parseInt(mileage[0]) : null,
        sailing_hours: sailing_hours && sailing_hours[0] ? parseInt(sailing_hours[0]) : null,
        condition: Array.isArray(condition) ? condition[0] : condition,
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