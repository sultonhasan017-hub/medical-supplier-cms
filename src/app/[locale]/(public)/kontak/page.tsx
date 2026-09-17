"use client";

import React, { useState, Suspense } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { generateWhatsAppLink } from '@/lib/whatsapp';

function ContactForm() {
  const searchParams = useSearchParams();
  const productQuery = searchParams.get('produk') || '';
  const t = useTranslations('Kontak');

  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    kebutuhan: productQuery,
    kuantitas: '',
    catatan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Sanitasi teks sederhana di sisi klien:
   * Menghapus semua tag HTML dari input sebelum dikirimkan ke WhatsApp.
   * Ini mencegah injeksi markup ke dalam pesan WA.
   */
  const stripHtml = (input: string) =>
    input.replace(/<[^>]*>/g, '').trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitasi semua field sebelum dikirim
    const safeFormData = {
      nama: stripHtml(formData.nama),
      instansi: stripHtml(formData.instansi),
      kebutuhan: stripHtml(formData.kebutuhan),
      kuantitas: stripHtml(formData.kuantitas),
      catatan: stripHtml(formData.catatan),
    };
    
    // Retrieve phone number from environment variable
    const phoneNumber = process.env.NEXT_PUBLIC_WA_PHONE_NUMBER || '';
    
    // Generate clean URL from centralized utility
    const waLink = generateWhatsAppLink(phoneNumber, safeFormData);
    window.open(waLink, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--color-dark-navy)]">{t('nameLabel')}</label>
          <input 
            required
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
            placeholder={t('namePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--color-dark-navy)]">{t('hospitalLabel')}</label>
          <input 
            required
            name="instansi"
            value={formData.instansi}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
            placeholder={t('hospitalPlaceholder')} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--color-dark-navy)]">{t('productLabel')}</label>
        <input 
          required
          name="kebutuhan"
          value={formData.kebutuhan}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
          placeholder={t('productPlaceholder')} 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--color-dark-navy)]">{t('quantityLabel')}</label>
        <input 
          name="kuantitas"
          value={formData.kuantitas}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
          placeholder={t('quantityPlaceholder')} 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--color-dark-navy)]">{t('notesLabel')}</label>
        <textarea 
          name="catatan"
          value={formData.catatan}
          onChange={handleChange}
          rows={4} 
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
          placeholder={t('notesPlaceholder')} 
        />
      </div>
      
      <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8 font-bold">
        {t('submitBtn')}
      </Button>
    </form>
  );
}

export default function Kontak() {
  const t = useTranslations('Kontak');

  return (
    <div className="w-full bg-slate-50 pb-24">
      {/* Header (Full Width Background) */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-[var(--color-airy-blue)] bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banner.jpg" 
            alt="Kontak Banner" 
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

      <div className="container mx-auto px-4 md:px-6 mt-12 -translate-y-8">
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Kolom Kiri: Form WhatsApp */}
          <Card className="lg:col-span-3 border-none shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[var(--color-dark-navy)] mb-6">{t('formTitle')}</h2>
              <p className="text-sm text-slate-500 mb-8">
                {t('formDesc')}
              </p>
              
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </CardContent>
          </Card>

          {/* Kolom Kanan: Info & Maps */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md overflow-hidden bg-[var(--color-dark-navy)] text-white">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white">{t('contactInfoTitle')}</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent-sky)]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t('hqTitle')}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">Jl. Limbangansari, RT.02/RW.03, Limbangansari, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43251</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent-sky)]">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t('waTitle')}</p>
                        <p className="mt-1 text-sm text-slate-300">{process.env.NEXT_PUBLIC_WA_PHONE_NUMBER || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent-sky)]">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t('hoursTitle')}</p>
                        <p className="mt-1 text-sm text-slate-300">{t('hoursDetail')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden p-1">
              {/* Google Maps Embed */}
              <div className="aspect-[4/3] w-full rounded-lg bg-slate-200 overflow-hidden flex flex-col items-center justify-center relative group">
                <div className="absolute inset-0 bg-[url('https://maps.gstatic.com/mapfiles/api-3/images/cb_scout2_small.png')] bg-cover opacity-20"></div>
                <Navigation className="h-12 w-12 text-slate-400 mb-2 z-10" />
                <span className="text-sm font-medium text-slate-500 z-10">{t('mapTitle')}</span>
                <span className="text-xs text-slate-400 z-10">{t('mapAddress')}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
