import {useTranslations} from 'next-intl';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Headphones, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('Index');
  
  return (
    <div className="w-full">
      {/* Hero Section (Full Width Background) */}
      <section className="relative w-full h-[75vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banner.jpg" 
            alt="Distributor Resmi Alat Medis" 
            className="w-full h-full object-cover object-center opacity-60"
          />
          {/* Dark Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-200 md:text-xl font-medium drop-shadow-sm">
              {t('description')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-6">
              <Button size="lg" className="shadow-lg bg-[var(--color-primary-blue)] hover:bg-blue-700 text-white border-none" asChild>
                <Link href="/produk">{t('catalogButton')}</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-[var(--color-dark-navy)] transition-colors" asChild>
                <Link href="/kontak">{t('consultButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center divide-x divide-[var(--color-airy-blue)]">
            <div className="flex flex-col items-center justify-center space-y-2 p-4">
              <span className="text-4xl font-bold text-[var(--color-primary-blue)]">4+</span>
              <span className="text-sm font-medium text-[var(--color-dark-navy)]">{t('metrics.brands')}</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4">
              <span className="text-4xl font-bold text-[var(--color-primary-blue)]">100%</span>
              <span className="text-sm font-medium text-[var(--color-dark-navy)]">{t('metrics.original')}</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4">
              <span className="text-4xl font-bold text-[var(--color-primary-blue)]">Cianjur</span>
              <span className="text-sm font-medium text-[var(--color-dark-navy)]">{t('metrics.base')}</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4">
              <span className="text-4xl font-bold text-[var(--color-primary-blue)]">24/7</span>
              <span className="text-sm font-medium text-[var(--color-dark-navy)]">{t('metrics.support')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Klien & Mitra Kami Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-dark-navy)] md:text-3xl">{t('partners.title')}</h2>
            <p className="mt-2 text-slate-600">{t('partners.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {[
              { name: 'RSUP Nasional Dr. Cipto Mangunkusumo', img: '/mitra/RSUP Nasional Dr. Cipto Mangunkusumo.png' },
              { name: 'Siloam Hospitals Group', img: '/mitra/Siloam Hospitals Group.jpg' },
              { name: 'Hermina Hospitals', img: '/mitra/Hermina Hospitals.png' },
              { name: 'RSUD Sayang Cianjur', img: '/mitra/RSUD Sayang Cianjur.jpg' },
              { name: 'Klinik Medika Utama', img: '/mitra/Klinik Medika Utama.png' }
            ].map((client) => (
              <div key={client.name} className="group relative flex h-32 w-full items-center justify-center rounded-xl bg-slate-50 p-4 shadow-sm transition-all hover:shadow-md hover:bg-white border border-[var(--color-airy-blue)] overflow-hidden">
                <img 
                  src={client.img} 
                  alt={client.name} 
                  className="w-full h-full object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 mix-blend-multiply" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Showcase Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-dark-navy)] md:text-3xl">{t('brands.title')}</h2>
            <p className="mt-2 text-slate-600">{t('brands.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { name: 'Allchek', img: '/merek/Allchek.jpg' },
              { name: 'RealyTech', img: '/merek/RealyTech.jpg' },
              { name: 'Yasee', img: '/merek/Yasee.png' },
              { name: 'Ultracare', img: '/merek/Ultracare.jpg' }
            ].map((brand) => (
              <Link key={brand.name} href={`/produk?brand=${brand.name.toLowerCase()}`} className="group relative flex h-32 w-full items-center justify-center rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md border border-[var(--color-airy-blue)] overflow-hidden">
                <img 
                  src={brand.img} 
                  alt={brand.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Closing CTA */}
      <section className="bg-[var(--color-dark-navy)] py-20 text-white">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t('cta.title')}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            {t('cta.description')}
          </p>
          <Button size="lg" className="bg-white text-[var(--color-dark-navy)] hover:bg-[var(--color-airy-blue)] hover:text-[var(--color-primary-blue)]" asChild>
            <Link href="/kontak">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
