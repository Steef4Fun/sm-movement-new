import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the upload directory path
export const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true });

/**
 * Saves an array of files to the upload directory.
 * @param files An array of File objects from FormData.
 * @returns A promise that resolves with an array of public URL paths.
 */
export const saveFiles = async (files: File[]): Promise<string[]> => {
  const savedPaths: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}_${Math.round(Math.random() * 1E9)}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filePath, buffer);
    savedPaths.push(`/uploads/${filename}`);
  }

  return savedPaths;
};


/**
 * Deletes a file from the public uploads directory.
 * @param publicPath The public path of the file (e.g., /uploads/filename.jpg).
 */
export const deleteFile = async (publicPath: string) => {
  try {
    const filename = path.basename(publicPath);
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch (error) {
    console.error(`Failed to delete file: ${publicPath}`, error);
    // Don't throw error, just log it
  }
};