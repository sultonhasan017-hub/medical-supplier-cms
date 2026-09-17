import React from 'react';
import { Package, FileText, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const productCount = await prisma.product.count();
  const blogCount = await prisma.blog.count();
  const brandCount = await prisma.brand.count();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-dark-navy)]">Dashboard Utama</h1>
        <p className="text-slate-500">Ringkasan aktivitas dan metrik konten website PT Samudera Inti Medisindo.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-[var(--color-primary-blue)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-slate-500">Alat medis & laboratorium</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artikel Blog</CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogCount}</div>
            <p className="text-xs text-slate-500">Publikasi aktif</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merek Mitra</CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--color-accent-sky)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandCount}</div>
            <p className="text-xs text-slate-500">Prinsipal global</p>
          </CardContent>
        </Card>
        
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengunjung Bulan Ini</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-400">—</div>
            <p className="text-xs text-slate-400">Analytics belum terhubung</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
