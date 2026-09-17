import React from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { Calendar, Clock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

async function getArticles() {
  return await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });
}

export default async function BlogDaftar({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale); // Fix for next-intl expected a suspended thenable
  const articles = await getArticles();
  const t = await getTranslations('Blog');

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header (Full Width Background) */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-[var(--color-airy-blue)] bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banner.jpg" 
            alt="Blog Banner" 
            className="w-full h-full object-cover object-center opacity-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl drop-shadow-md">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200 font-medium drop-shadow-sm">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => {
              const title = locale === 'en' ? article.title_en : article.title_id;
              const metaDesc = locale === 'en' ? article.metaDesc_en : article.metaDesc_id;

              return (
                <Card key={article.id} className="group overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border border-[var(--color-airy-blue)]">
                  <Link href={`/blog/${article.slug}`} className="relative aspect-video w-full overflow-hidden bg-slate-100 block">
                    {article.thumbnailUrl ? (
                      <img
                        src={article.thumbnailUrl}
                        alt={article.thumbnailAlt || title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-[var(--color-airy-blue)] text-slate-400">
                        <img src="/hero-banner.jpg" alt="" className="h-full w-full object-cover opacity-20" />
                        <span className="absolute text-xs font-medium text-slate-500 bg-white/80 px-2.5 py-1 rounded-full backdrop-blur-xs">PT SIM Medis</span>
                      </div>
                    )}
                  </Link>
                  <CardContent className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-[var(--color-primary-blue)]" />
                        {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[var(--color-primary-blue)]" />
                        <span>{t('readTime')}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[var(--color-dark-navy)] line-clamp-2 mb-3 group-hover:text-[var(--color-primary-blue)] transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {title}
                      </Link>
                    </h3>
                    
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                      {metaDesc}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500">{t('authorPrefix')} {article.author?.name || t('admin')}</span>
                      <Button variant="ghost" size="sm" className="gap-2" asChild>
                        <Link href={`/blog/${article.slug}`}>{t('readMore')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl border border-[var(--color-airy-blue)]">
            <h3 className="text-2xl font-bold text-[var(--color-dark-navy)] mb-2">{t('emptyTitle')}</h3>
            <p className="text-slate-600">{t('emptyDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
