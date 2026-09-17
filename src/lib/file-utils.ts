import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Helper to safely delete an uploaded file from the public/uploads directory.
 * @param url The public URL of the file (e.g. /uploads/filename.ext)
 */
export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url || !url.startsWith('/uploads/')) return;
  
  try {
    const filename = url.replace('/uploads/', '');
    const filepath = join(process.cwd(), 'public/uploads', filename);
    await unlink(filepath);
  } catch (error) {
    // Abaikan jika file tidak ditemukan, dll
    console.error(`[deleteUploadedFile] Failed to delete ${url}:`, error);
  }
}
