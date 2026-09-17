import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import prisma from '@/lib/prisma';
import MobileMenu from './MobileMenu';

export default async function Navbar() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations('Navbar');
  // Ambil data brand dari database
  const brands = await prisma.brand.findMany({
    take: 6, // Batasi jumlah brand di menu dropdown agar tidak terlalu panjang
    orderBy: { name: 'asc' }
  });
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-airy-blue)] bg-white shadow-[0_2px_8px_rgba(23,58,94,0.06)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* Logo stetoskop/kristal medis biru (#2F78C8) */}
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary-blue)] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div> */}
          <span className="text-xl font-bold text-[var(--color-dark-navy)]">
            PT Samudera Inti Medisindo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--color-dark-navy)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href="/tentang-perusahaan"
            className="text-sm font-semibold text-[var(--color-dark-navy)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            {t('about')}
          </Link>
          
          {/* Dropdown Produk */}
          <div className="group relative">
            <Link
              href="/produk"
              className="flex items-center gap-1 text-sm font-semibold text-[var(--color-dark-navy)] hover:text-[var(--color-primary-blue)] transition-colors"
            >
              {t('products')} <ChevronDown className="h-4 w-4" />
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full hidden w-[400px] pt-4 group-hover:block">
              <div className="rounded-xl border border-[var(--color-airy-blue)] bg-white p-4 shadow-[0_12px_24px_rgba(47,120,200,0.12)]">
                <div className="grid grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <Link key={brand.id} href={`/produk?brand=${brand.name.toLowerCase()}`} className="block rounded-lg p-3 hover:bg-[var(--color-airy-blue)] transition-colors">
                      <div className="font-semibold text-[var(--color-dark-navy)]">{brand.name}</div>
                      <p className="mt-1 text-xs text-slate-500">{brand.description}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 border-t border-[var(--color-airy-blue)] pt-4">
                  <Link href="/produk" className="text-sm font-medium text-[var(--color-primary-blue)] hover:underline">
                    {t('allProducts')} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/blog"
            className="text-sm font-semibold text-[var(--color-dark-navy)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            {t('blog')}
          </Link>
          <Link
            href="/kontak"
            className="text-sm font-semibold text-[var(--color-dark-navy)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            {t('contact')}
          </Link>
        </nav>

        {/* Right Section: Language & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/kontak">{t('contactBtn')}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu t={{
          home: t('home'),
          about: t('about'),
          products: t('products'),
          allProducts: t('allProducts'),
          blog: t('blog'),
          contact: t('contact'),
          contactBtn: t('contactBtn')
        }} brands={brands} />
      </div>
    </header>
  );
}
