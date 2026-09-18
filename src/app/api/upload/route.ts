import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { existsSync } from 'fs';
import { getSession } from '@/lib/auth';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB (Batas maksimal serverless request body di Vercel)

// MIME type yang diizinkan (berdasarkan content-type dari client)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf'];

export async function POST(request: NextRequest) {
  // ✅ Autentikasi: Hanya pengguna yang sudah login yang boleh upload
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // ✅ Validasi ukuran file (maks 4.5MB sesuai limit Vercel)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas maksimal 4.5MB' },
        { status: 413 }
      );
    }

    // ✅ Validasi tipe file
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isDoc = ALLOWED_DOC_TYPES.includes(file.type);

    if (!isImage && !isDoc) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak diizinkan. Hanya JPEG, PNG, WebP, GIF, atau PDF.' },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pisahkan direktori upload berdasarkan tipe file
    const subDir = isImage ? 'images' : 'documents';

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    let filename = '';
    let finalBuffer = buffer;

    if (isDoc) {
      // Validasi Magic Bytes (PDF files must start with %PDF-)
      const header = buffer.subarray(0, 5).toString('ascii');
      if (header !== '%PDF-') {
        return NextResponse.json(
          { success: false, error: 'File PDF terdeteksi tidak valid atau dimanipulasi.' },
          { status: 415 }
        );
      }
      
      // Untuk PDF — sanitasi nama file
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 80);
      filename = `doc-${uniqueSuffix}-${safeName}`;
    }

    if (isImage) {
      // Resize dan konversi ke WebP untuk optimasi
      finalBuffer = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      filename = `img-${uniqueSuffix}.webp`;
    }

    // ✅ Prioritas 1: Jika BLOB_READ_WRITE_TOKEN tersedia, upload langsung ke Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const contentType = isImage ? 'image/webp' : 'application/pdf';
      const blob = await put(`uploads/${subDir}/${filename}`, finalBuffer, {
        access: 'public',
        contentType,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
      });
    }

    // ✅ Prioritas 2 (Fallback untuk Lokal Development): Simpan ke folder public/uploads
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Vercel Blob Storage belum dikonfigurasi. Silakan aktifkan Vercel Blob di tab Storage dashboard Vercel.',
        },
        { status: 500 }
      );
    }

    const uploadDir = join(process.cwd(), `public/uploads/${subDir}`);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const path = join(uploadDir, filename);
    await writeFile(path, finalBuffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${subDir}/${filename}`,
    });

  } catch (error) {
    // Log ke server, tidak ekspos detail ke client
    console.error('[upload] Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengupload file' }, { status: 500 });
  }
}
