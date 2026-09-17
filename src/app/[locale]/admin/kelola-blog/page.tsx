import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import prisma from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { Plus, Pencil } from 'lucide-react';
import { DeleteBlogButton } from '@/components/admin/DeleteBlogButton';

export default async function KelolaBlog() {
  const articles = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark-navy)]">Kelola Artikel (Blog)</h1>
          <p className="text-sm text-slate-500">Manajemen konten berita dan artikel kesehatan.</p>
        </div>
        <Button asChild>
          <Link href="/admin/kelola-blog/buat" className="gap-2">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <EmptyState 
          title="Belum Ada Artikel" 
          description="Anda belum menulis artikel. Publikasikan informasi terkini untuk audiens B2B Anda."
          actionLabel="Tulis Artikel Baru"
        />
      ) : (
        <div className="rounded-xl border border-[var(--color-airy-blue)] bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Artikel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium text-[var(--color-dark-navy)]">
                    <div className="flex items-center gap-3">
                      {article.thumbnailUrl ? (
                        <img
                          src={article.thumbnailUrl}
                          alt={article.thumbnailAlt || article.title_id}
                          className="h-12 w-16 rounded-md object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0 border border-slate-200">
                          No Img
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-[var(--color-dark-navy)] block truncate">{article.title_id}</span>
                        <div className="text-xs text-slate-400 mt-0.5 max-w-md truncate">{article.metaDesc_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {article.isPublished ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="draft">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(article.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[var(--color-primary-blue)]" asChild>
                        <Link href={`/admin/kelola-blog/${article.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteBlogButton id={article.id} title={article.title_id} />
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
