"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { sanitizeText, sanitizeRichHtml } from '@/lib/sanitize';

async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: sesi tidak valid, silakan login kembali');
  }
  return session;
}

export async function updateBlogAction(id: string, formData: FormData) {
  await requireAuth();

  const title_id = sanitizeText(formData.get('title_id') as string);
  const content_id = sanitizeRichHtml(formData.get('content_id') as string);
  const metaDesc_id = sanitizeText(formData.get('metaDesc_id') as string);
  const title_en = sanitizeText(formData.get('title_en') as string);
  const content_en = sanitizeRichHtml(formData.get('content_en') as string);
  const metaDesc_en = sanitizeText(formData.get('metaDesc_en') as string);
  const isPublished = formData.get('isPublished') === 'true';
  const thumbnailUrl = formData.get('thumbnailUrl') as string; // URL
  const thumbnailAlt = sanitizeText(formData.get('thumbnailAlt') as string);
  const additionalImagesRaw = formData.get('additionalImages') as string;

  if (!title_id || !content_id || !metaDesc_id || !title_en || !content_en || !metaDesc_en) {
    return { error: 'Semua field wajib diisi di kedua bahasa' };
  }

  let additionalImages: string[] = [];
  try {
    additionalImages = JSON.parse(additionalImagesRaw || '[]');
  } catch {
    additionalImages = [];
  }

  try {
    // Ambil data lama untuk cleanup
    const oldBlog = await prisma.blog.findUnique({ where: { id } });

    await prisma.blog.update({
      where: { id },
      data: {
        title_id,
        content_id,
        metaDesc_id,
        title_en,
        content_en,
        metaDesc_en,
        thumbnailUrl: thumbnailUrl || null,
        thumbnailAlt: thumbnailAlt || null,
        additionalImages,
        isPublished,
      }
    });

    // Cleanup logika
    if (oldBlog) {
      const { deleteUploadedFile } = await import('@/lib/file-utils');
      
      // Jika thumbnail utama berubah/dihapus
      if (oldBlog.thumbnailUrl && oldBlog.thumbnailUrl !== thumbnailUrl) {
        await deleteUploadedFile(oldBlog.thumbnailUrl);
      }
      
      // Jika ada gambar tambahan yang dihapus
      if (oldBlog.additionalImages) {
        for (const oldImg of oldBlog.additionalImages) {
          if (!additionalImages.includes(oldImg)) {
            await deleteUploadedFile(oldImg);
          }
        }
      }
    }

    revalidatePath('/blog');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { error: 'Gagal memperbarui artikel' };
  }
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({ where: { id } });
}
