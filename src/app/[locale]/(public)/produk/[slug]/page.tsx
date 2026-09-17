import React from 'react';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';
import { Download, FileText, ChevronRight } from 'lucide-react';
import ProductGallery from '@/components/admin/ProductGallery';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true }
  });
  return product;
}

export default async function DetailProduk({
  params
}: {
  params: Promise<{ slug: string, locale: string }>
}) {
  const { slug, locale } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full bg-white pb-24">
      {/* Breadcrumb Navigasi */}
      <div className="bg-slate-50 border-b border-[var(--color-airy-blue)] py-4">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-[var(--color-primary-blue)] transition-colors">Beranda</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/produk" className="hover:text-[var(--color-primary-blue)] transition-colors">Katalog Produk</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href={`/produk?brand=${product.brand.name.toLowerCase()}`} className="hover:text-[var(--color-primary-blue)] transition-colors">
              {product.brand.name}
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-[var(--color-dark-navy)]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        {/* Layout 2 Kolom */}
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Sisi Kiri: Galeri Produk */}
          <ProductGallery
            mainImage={product.imageUrl}
            mainImageAlt={product.imageAlt}
            additionalImages={product.additionalImages || []}
          />

          {/* Sisi Kanan: Detail Produk */}
          <div className="flex flex-col">
            <Badge variant="brand" className="mb-4 self-start text-sm px-3 py-1">
              {product.brand.name}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark-navy)] mb-6">
              {product.name}
            </h1>
            
            <div className="prose prose-slate mb-8 max-w-none">
              <p className="text-lg leading-relaxed text-slate-600">
                {locale === 'en' ? product.description_en : product.description_id}
              </p>
              
              <h3 className="mt-8 text-xl font-semibold text-[var(--color-dark-navy)]">
                {locale === 'en' ? 'Technical Specifications' : 'Spesifikasi Teknis'}
              </h3>
              <div className="mt-4 rounded-xl border border-[var(--color-airy-blue)] bg-slate-50 p-6 text-sm text-slate-600">
                {locale === 'en' ? (product.specs_en || 'Specs not available') : (product.specs_id || 'Spesifikasi tidak tersedia')}
              </div>
            </div>

            <div className="mt-auto pt-8 flex flex-col gap-4 sm:flex-row border-t border-[var(--color-airy-blue)]">
              {product.brochureUrl && (
                <Button variant="outline" size="lg" className="flex-1 gap-2" asChild>
                  <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5" />
                    Download Spesifikasi Teknis (PDF)
                  </a>
                </Button>
              )}
              <Button size="lg" className="flex-1 gap-2" asChild>
                <Link href={`/kontak?produk=${encodeURIComponent(product.name)}`}>
                  <FileText className="h-5 w-5" />
                  Minta Penawaran Harga
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
