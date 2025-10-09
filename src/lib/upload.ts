import { NextRequest } from 'next/server';
import formidable, { File, Fields, Files } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Define the upload directory path
export const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true });

interface FormidableParseResult {
  fields: Fields;
  files: Files;
}

/**
 * Parses a multipart form request.
 * @param req The Next.js request object.
 * @returns A promise that resolves with the parsed fields and files.
 */
export const parseForm = (req: NextRequest): Promise<FormidableParseResult> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      // Create a unique filename to avoid overwrites
      filename: (name, ext, part) => {
        const originalFilename = part.originalFilename || 'file';
        return `${Date.now()}_${Math.round(Math.random() * 1E9)}_${originalFilename.replace(/\s+/g, '_')}`;
      },
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

/**
 * Converts formidable File objects to public URL paths.
 * @param files A File, an array of Files, or undefined.
 * @returns An array of public URL strings.
 */
export const getPublicPaths = (files: File | File[] | undefined): string[] => {
  if (!files) return [];
  const fileArray = Array.isArray(files) ? files : [files];
  return fileArray.map(file => `/uploads/${path.basename(file.filepath)}`);
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