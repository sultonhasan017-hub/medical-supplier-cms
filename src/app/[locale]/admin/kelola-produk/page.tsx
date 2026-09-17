import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import prisma from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { Plus, Pencil } from 'lucide-react';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export default async function KelolaProduk() {
  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark-navy)]">Kelola Produk</h1>
          <p className="text-sm text-slate-500">Manajemen katalog alat kesehatan dan laboratorium.</p>
        </div>
        <Button asChild>
          <Link href="/admin/kelola-produk/buat" className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState 
          title="Belum Ada Produk" 
          description="Katalog produk saat ini masih kosong. Silakan tambahkan produk baru."
          actionLabel="Tambah Produk Baru"
        />
      ) : (
        <div className="rounded-xl border border-[var(--color-airy-blue)] bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Alat</TableHead>
                <TableHead>Merek</TableHead>
                <TableHead>Gambar (Alt Text)</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-[var(--color-dark-navy)]">
                    {product.name}
                    <div className="text-xs text-slate-400">{product.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="brand">{product.brand.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.imageAlt ? (
                      <span className="text-xs text-emerald-600 font-medium">Valid ({product.imageAlt.substring(0, 20)}...)</span>
                    ) : (
                      <span className="text-xs text-red-500 font-medium">Kosong</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[var(--color-primary-blue)]" asChild>
                        <Link href={`/admin/kelola-produk/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
