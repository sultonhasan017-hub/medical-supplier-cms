import React from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';
import { EmptyState } from '@/components/shared/EmptyState';

// Fetch products from database
async function getProducts(brand?: string) {
  const products = await prisma.product.findMany({
    where: brand ? {
      brand: {
        name: {
          equals: brand,
          mode: 'insensitive'
        }
      }
    } : undefined,
    include: {
      brand: true
    }
  });
  return products;
}

export default async function KatalogProduk({
  searchParams
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  const { brand } = await searchParams;
  const currentBrand = brand || 'Semua Produk';
  const products = await getProducts(brand);

  // Ambil data brand dari database
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header (Full Width Background) */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-[var(--color-airy-blue)] bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banner.jpg" 
            alt="Produk Banner" 
            className="w-full h-full object-cover object-center opacity-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl drop-shadow-md">
            Katalog Produk Alat Kesehatan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200 font-medium drop-shadow-sm">
            Jelajahi koleksi lengkap instrumen medis presisi, perangkat diagnostik, dan barang habis pakai klinis dari merek-merek terkemuka dunia.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Button
            variant={!brand ? 'default' : 'outline'}
            className="rounded-full"
            asChild
          >
            <Link href="/produk">Semua Produk</Link>
          </Button>
          
          {brands.map((brandItem) => (
            <Button
              key={brandItem.id}
              variant={
                brand && brandItem.name.toLowerCase() === brand.toLowerCase()
                  ? 'default'
                  : 'outline'
              }
              className="rounded-full"
              asChild
            >
              <Link href={`/produk?brand=${brandItem.name.toLowerCase()}`}>
                {brandItem.name}
              </Link>
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <Card key={product.id} className="group overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square w-full bg-[var(--color-airy-blue)] p-6">
                  <Badge variant="brand" className="absolute top-4 left-4 z-10">
                    {product.brand.name}
                  </Badge>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.imageAlt || product.name}
                      className="h-full w-full rounded-lg object-cover shadow-sm bg-white"
                    />
                  ) : (
                    <div className="h-full w-full rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <span className="text-xs text-slate-400">Gambar Produk</span>
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col flex-1 p-5">
                  <h3 className="text-lg font-semibold text-[var(--color-dark-navy)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary-blue)] transition-colors">
                    <Link href={`/produk/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-auto pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/produk/${product.slug}`}>Lihat Detail Spesifikasi</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState 
              title="Produk Tidak Ditemukan" 
              description={`Kami tidak dapat menemukan produk untuk kategori ${currentBrand}.`}
              actionLabel="Lihat Semua Produk"
              onAction={() => {}} // Will use Link in actual component if needed, or just standard href
            />
            {/* Workaround for action on EmptyState */}
            <div className="flex justify-center -mt-6">
               <Button asChild><Link href="/produk">Reset Filter</Link></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
