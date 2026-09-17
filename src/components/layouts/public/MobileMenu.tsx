'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

interface MobileMenuProps {
  t: {
    home: string;
    about: string;
    products: string;
    allProducts: string;
    blog: string;
    contact: string;
    contactBtn: string;
  };
  brands: {
    id: string;
    name: string;
    description: string | null;
  }[];
}

export default function MobileMenu({ t, brands }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <>
      <button 
        onClick={toggleMenu}
        className="md:hidden text-[var(--color-dark-navy)] p-2"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-16 w-full bg-white border-b border-[var(--color-airy-blue)] shadow-lg md:hidden flex flex-col animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link href="/" onClick={closeMenu} className="text-base font-semibold text-[var(--color-dark-navy)]">
              {t.home}
            </Link>
            <Link href="/tentang-perusahaan" onClick={closeMenu} className="text-base font-semibold text-[var(--color-dark-navy)]">
              {t.about}
            </Link>
            
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between text-base font-semibold text-[var(--color-dark-navy)] w-full text-left"
              >
                {t.products}
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProductsOpen && (
                <div className="flex flex-col pl-4 space-y-3 mt-2 border-l-2 border-[var(--color-airy-blue)]">
                  {brands.map(brand => (
                    <Link 
                      key={brand.id} 
                      href={`/produk?brand=${brand.name.toLowerCase()}`}
                      onClick={closeMenu}
                      className="text-sm text-slate-600"
                    >
                      {brand.name}
                    </Link>
                  ))}
                  <Link href="/produk" onClick={closeMenu} className="text-sm font-medium text-[var(--color-primary-blue)] pt-2">
                    {t.allProducts} &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" onClick={closeMenu} className="text-base font-semibold text-[var(--color-dark-navy)]">
              {t.blog}
            </Link>
            <Link href="/kontak" onClick={closeMenu} className="text-base font-semibold text-[var(--color-dark-navy)]">
              {t.contact}
            </Link>

            <div className="border-t border-[var(--color-airy-blue)] pt-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Bahasa / Language</span>
                <LanguageSwitcher />
              </div>
              <Button className="w-full" asChild>
                <Link href="/kontak" onClick={closeMenu}>{t.contactBtn}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
