import React from 'react';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { Calendar, ChevronLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ArticleGallery from '@/components/shared/ArticleGallery';
import ShareBar from '@/components/shared/ShareBar';

async function getArticle(slug: string) {
  const article = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true }
  });
  return article;
}

export default async function DetailArtikel({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug);
  const t = await getTranslations('Blog');

  if (!article) {
    notFound();
  }

  const title = locale === 'en' ? article.title_en : article.title_id;
  const content = locale === 'en' ? article.content_en : article.content_id;

  return (
    <div className="w-full bg-white pb-24">
      <div className="container mx-auto px-4 md:px-6 pt-12">
        <Button variant="ghost" className="mb-8 gap-2 text-slate-500 hover:text-[var(--color-primary-blue)]" asChild>
          <Link href="/blog">
            <ChevronLeft className="h-4 w-4" />
            {t('backToBlog')}
          </Link>
        </Button>
        
        <div className="mx-auto max-w-3xl">
          
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-dark-navy)] leading-tight mb-6">
            {title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 border-b border-slate-100 pb-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[var(--color-airy-blue)] flex items-center justify-center text-[var(--color-primary-blue)] font-bold">
                {article.author?.name ? article.author.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-dark-navy)]">{article.author?.name || t('admin')}</p>
                <p className="text-xs">Penulis</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>
                {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          {/* Galeri Gambar Artikel */}
          <ArticleGallery
            mainImage={article.thumbnailUrl}
            mainImageAlt={article.thumbnailAlt || title}
            additionalImages={article.additionalImages || []}
            title={title}
          />
          
          <div className="prose prose-lg prose-slate max-w-none text-slate-600">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          
          <ShareBar title={title} />
        </div>
      </div>
    </div>
  );
}
