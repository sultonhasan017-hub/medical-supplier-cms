"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { deleteUploadedFile } from '@/lib/file-utils';
import { sanitizeText } from '@/lib/sanitize';

async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: sesi tidak valid, silakan login kembali');
  }
  return session;
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAuth();

  const name = sanitizeText(formData.get('name') as string);
  const brandId = formData.get('brandId') as string; // ID FK
  const description_id = sanitizeText(formData.get('description_id') as string);
  const description_en = sanitizeText(formData.get('description_en') as string);
  const specs_id = sanitizeText(formData.get('specs_id') as string) || null;
  const specs_en = sanitizeText(formData.get('specs_en') as string) || null;
  const brochureUrl = (formData.get('brochureUrl') as string) || null; // URL
  const imageAlt = sanitizeText(formData.get('imageAlt') as string);
  const imageUrl = (formData.get('imageUrl') as string); // URL path
  const additionalImagesRaw = formData.get('additionalImages') as string;

  if (!name || !brandId || !description_id || !description_en || !imageAlt) {
    return { error: 'Semua field wajib diisi' };
  }

  let additionalImages: string[] = [];
  try {
    additionalImages = JSON.parse(additionalImagesRaw || '[]');
  } catch {
    additionalImages = [];
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    // Ambil data lama untuk membersihkan file yang dihapus/diganti
    const oldProduct = await prisma.product.findUnique({ where: { id } });

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        brandId,
        description_id,
        description_en,
        specs_id,
        specs_en,
        brochureUrl,
        imageAlt,
        ...(imageUrl ? { imageUrl } : {}),
        additionalImages,
      }
    });

    // Cleanup: hapus file lama dari storage jika diganti/dihapus
    if (oldProduct) {
      if (imageUrl && oldProduct.imageUrl !== imageUrl) {
        await deleteUploadedFile(oldProduct.imageUrl);
      }
      if (oldProduct.brochureUrl && oldProduct.brochureUrl !== brochureUrl) {
        await deleteUploadedFile(oldProduct.brochureUrl);
      }
      if (oldProduct.additionalImages) {
        for (const oldImg of oldProduct.additionalImages) {
          if (!additionalImages.includes(oldImg)) {
            await deleteUploadedFile(oldImg);
          }
        }
      }
    }

    revalidatePath('/produk');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { error: 'Gagal memperbarui produk' };
  }
}

/**
 * Alias untuk getBrands — dipertahankan agar tidak merusak import di edit/page.tsx.
 * Sumber tunggal ada di buat/actions.ts untuk menghindari duplikasi.
 */
export async function getBrandsForEdit() {
  return await prisma.brand.findMany({ orderBy: { name: 'asc' } });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { brand: true }
  });
}
