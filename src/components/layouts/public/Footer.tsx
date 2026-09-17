import { Link } from '@/i18n/routing';
import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="border-t-4 border-t-[var(--color-primary-blue)] bg-[var(--color-dark-navy)] text-white">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Kolom 1: Identitas PT Samudera Inti Medisindo */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">PT Samudera Inti Medisindo</h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {t('description')}
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">{t('certified')}</span>
            </div>
          </div>

          {/* Kolom 2: Alamat lengkap & Nomor Telepon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contactTitle')}</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[var(--color-accent-sky)]" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[var(--color-accent-sky)]" />
                <span>{process.env.NEXT_PUBLIC_WA_PHONE_NUMBER || '-'}</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Cepat (Sitemap) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('sitemapTitle')}</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-[var(--color-accent-sky)] hover:underline">Beranda</Link>
              </li>
              <li>
                <Link href="/tentang-perusahaan" className="hover:text-[var(--color-accent-sky)] hover:underline">Tentang Perusahaan</Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-[var(--color-accent-sky)] hover:underline">Katalog Produk</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--color-accent-sky)] hover:underline">Blog</Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[var(--color-accent-sky)] hover:underline">Kontak</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Merek & Sosial Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('brandsTitle')}</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/produk?brand=allchek" className="rounded bg-white/10 px-3 py-1 text-xs font-medium hover:bg-[var(--color-primary-blue)] transition-colors">Allchek</Link>
              <Link href="/produk?brand=realytech" className="rounded bg-white/10 px-3 py-1 text-xs font-medium hover:bg-[var(--color-primary-blue)] transition-colors">RealyTech</Link>
              <Link href="/produk?brand=yasee" className="rounded bg-white/10 px-3 py-1 text-xs font-medium hover:bg-[var(--color-primary-blue)] transition-colors">Yasee</Link>
              <Link href="/produk?brand=ultracare" className="rounded bg-white/10 px-3 py-1 text-xs font-medium hover:bg-[var(--color-primary-blue)] transition-colors">Ultracare</Link>
            </div>
            
            <h3 className="mt-6 text-lg font-semibold">{t('socialTitle')}</h3>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/simcorp.id/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 text-white hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://web.facebook.com/ptsim.id/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 text-white hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE_NUMBER || ''}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 text-white hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors">
                <FaWhatsapp className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Hak Cipta */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
