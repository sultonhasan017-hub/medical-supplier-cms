"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { sanitizeText, sanitizeRichHtml } from '@/lib/sanitize';

export async function createBlogAction(formData: FormData) {
  const title_id = sanitizeText(formData.get('title_id') as string);
  const content_id = sanitizeRichHtml(formData.get('content_id') as string);
  const metaDesc_id = sanitizeText(formData.get('metaDesc_id') as string);
  
  const title_en = sanitizeText(formData.get('title_en') as string);
  const content_en = sanitizeRichHtml(formData.get('content_en') as string);
  const metaDesc_en = sanitizeText(formData.get('metaDesc_en') as string);
  const thumbnailUrl = formData.get('thumbnailUrl') as string; // URL
  const thumbnailAlt = sanitizeText(formData.get('thumbnailAlt') as string);
  const additionalImagesRaw = formData.get('additionalImages') as string;

  let slug = sanitizeText(formData.get('slug') as string);

  if (!title_id || !content_id || !metaDesc_id || !title_en || !content_en || !metaDesc_en) {
    return { error: 'Semua field wajib diisi di kedua bahasa' };
  }

  // Parse additional images safely
  let additionalImages: string[] = [];
  try {
    additionalImages = JSON.parse(additionalImagesRaw || '[]');
  } catch {
    additionalImages = [];
  }

  // Generate slug if empty
  if (!slug || slug.trim() === '') {
    slug = title_id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'Sesi tidak valid, silakan login kembali' };
  }

  try {
    await prisma.blog.create({
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
        slug,
        authorId: session.user.id,
        isPublished: true,
      }
    });
    
    revalidatePath('/blog');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return { error: 'Slug sudah digunakan, silakan pilih slug lain' };
    }
    return { error: 'Gagal menyimpan artikel ke database' };
  }
}

export async function deleteBlogAction(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'Unauthorized: sesi tidak valid' };
  }

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (blog) {
      const { deleteUploadedFile } = await import('@/lib/file-utils');
      
      // Hapus thumbnail utama
      if (blog.thumbnailUrl) {
        await deleteUploadedFile(blog.thumbnailUrl);
      }
      
      // Hapus gambar tambahan
      if (blog.additionalImages && blog.additionalImages.length > 0) {
        for (const img of blog.additionalImages) {
          await deleteUploadedFile(img);
        }
      }
    }

    await prisma.blog.delete({ where: { id } });
    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Gagal menghapus artikel' };
  }
}
