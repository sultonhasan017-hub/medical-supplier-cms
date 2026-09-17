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

export async function createProductAction(formData: FormData) {
  await requireAuth();

  const name = sanitizeText(formData.get('name') as string);
  const brandId = formData.get('brandId') as string; // ID FK, tidak perlu sanitasi teks
  const description_id = sanitizeText(formData.get('description_id') as string);
  const description_en = sanitizeText(formData.get('description_en') as string);
  const specs_id = sanitizeText(formData.get('specs_id') as string) || null;
  const specs_en = sanitizeText(formData.get('specs_en') as string) || null;
  const brochureUrl = (formData.get('brochureUrl') as string) || null; // URL
  const imageAlt = sanitizeText(formData.get('imageAlt') as string);
  const imageUrl = (formData.get('imageUrl') as string); // URL path
  const additionalImagesRaw = formData.get('additionalImages') as string;

  if (!name || !brandId || !description_id || !description_en || !imageAlt || !imageUrl) {
    return { error: 'Semua field wajib diisi' };
  }

  // Parse additional images safely
  let additionalImages: string[] = [];
  try {
    additionalImages = JSON.parse(additionalImagesRaw || '[]');
  } catch {
    additionalImages = [];
  }

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await prisma.product.create({
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
        imageUrl,
        additionalImages,
      }
    });

    revalidatePath('/produk');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { error: 'Gagal menyimpan produk ke database' };
  }
}

/**
 * Mengambil daftar semua brand untuk digunakan di form produk.
 * Fungsi tunggal — tidak perlu getBrandsForEdit() yang terpisah.
 */
export async function getBrands() {
  return await prisma.brand.findMany({ orderBy: { name: 'asc' } });
}

export async function deleteProductAction(id: string) {
  await requireAuth();

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      // Hapus file utama
      await deleteUploadedFile(product.imageUrl);

      // Hapus PDF brosur
      if (product.brochureUrl) {
        await deleteUploadedFile(product.brochureUrl);
      }

      // Hapus galeri tambahan
      if (product.additionalImages && product.additionalImages.length > 0) {
        for (const img of product.additionalImages) {
          await deleteUploadedFile(img);
        }
      }
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath('/produk');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Gagal menghapus produk' };
  }
}
