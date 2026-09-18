import { unlink } from 'fs/promises';
import { join } from 'path';
import { del } from '@vercel/blob';

/**
 * Helper to safely delete an uploaded file from Vercel Blob or local storage.
 * @param url The public URL of the file (e.g. /uploads/... or https://...blob.vercel-storage.com/...)
 */
export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url) return;

  try {
    // 1. Jika file tersimpan di Vercel Blob Storage
    if (url.includes('blob.vercel-storage.com') || (process.env.BLOB_READ_WRITE_TOKEN && url.startsWith('http'))) {
      await del(url);
      return;
    }

    // 2. Jika file tersimpan di folder public/uploads/ lokal
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filepath = join(process.cwd(), 'public/uploads', filename);
      await unlink(filepath);
    }
  } catch (error) {
    // Abaikan jika file tidak ditemukan, dll
    console.error(`[deleteUploadedFile] Failed to delete ${url}:`, error);
  }
}

