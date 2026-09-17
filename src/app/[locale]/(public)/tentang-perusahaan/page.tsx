import { Building2, Stethoscope, BriefcaseMedical, TestTube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function TentangPerusahaan() {
  const t = useTranslations('Tentang');
  
  return (
    <div className="w-full">
      {/* Header Halaman (Full Width Background) */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banner.jpg" 
            alt="Corporate Banner" 
            className="w-full h-full object-cover object-center opacity-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl drop-shadow-md">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-200 font-medium drop-shadow-sm">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Blok Profil & Sejarah */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-[var(--color-dark-navy)]">{t('profileTitle')}</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>{t('profileP1')}</p>
                <p>{t('profileP2')}</p>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--color-airy-blue)] bg-slate-50">
              <div className="flex h-full items-center justify-center">
                <img src="/hero-image.jpg" alt="Corporate Banner" className="w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blok Visi & Misi */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-dark-navy)]">{t('visionTitle')}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-l-4 border-l-[var(--color-primary-blue)]">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--color-primary-blue)]">{t('vision')}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                {t('visionDesc')}
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-[var(--color-primary-blue)]">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--color-primary-blue)]">{t('mission')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>{t('mission1')}</li>
                  <li>{t('mission2')}</li>
                  <li>{t('mission3')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Jangkauan Klien & Mitra */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-dark-navy)]">{t('partnersTitle')}</h2>
            <p className="mt-4 text-slate-600">{t('partnersDesc')}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-airy-blue)] p-8 text-center hover:bg-slate-50 transition-colors">
              <Building2 className="mb-4 h-12 w-12 text-[var(--color-accent-sky)]" />
              <h3 className="font-semibold text-[var(--color-dark-navy)]">{t('partner1')}</h3>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-airy-blue)] p-8 text-center hover:bg-slate-50 transition-colors">
              <Stethoscope className="mb-4 h-12 w-12 text-[var(--color-accent-sky)]" />
              <h3 className="font-semibold text-[var(--color-dark-navy)]">{t('partner2')}</h3>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-airy-blue)] p-8 text-center hover:bg-slate-50 transition-colors">
              <TestTube className="mb-4 h-12 w-12 text-[var(--color-accent-sky)]" />
              <h3 className="font-semibold text-[var(--color-dark-navy)]">{t('partner3')}</h3>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-airy-blue)] p-8 text-center hover:bg-slate-50 transition-colors">
              <BriefcaseMedical className="mb-4 h-12 w-12 text-[var(--color-accent-sky)]" />
              <h3 className="font-semibold text-[var(--color-dark-navy)]">{t('partner4')}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
