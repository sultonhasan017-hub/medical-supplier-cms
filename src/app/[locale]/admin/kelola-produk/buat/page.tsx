"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createProductAction, getBrands } from './actions';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, X, ImagePlus, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function FormProduk() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        toast.success('Gambar utama berhasil diunggah');
      } else {
        toast.error('Gagal mengunggah gambar');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (additionalImages.length >= 5) {
      toast.error('Maksimal 5 gambar tambahan');
      return;
    }
    setUploadingAdditional(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setAdditionalImages(prev => [...prev, data.url]);
        toast.success('Gambar tambahan berhasil diunggah');
      } else {
        toast.error('Gagal mengunggah gambar tambahan');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah');
    } finally {
      setUploadingAdditional(false);
      e.target.value = '';
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingBrochure(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setBrochureUrl(data.url);
        toast.success('Brosur PDF berhasil diunggah');
      } else {
        toast.error(data.error || 'Gagal mengunggah brosur');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah brosur');
    } finally {
      setUploadingBrochure(false);
      e.target.value = '';
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('imageUrl', imageUrl);
    formData.append('additionalImages', JSON.stringify(additionalImages));
    if (brochureUrl) {
      formData.append('brochureUrl', brochureUrl);
    }

    const imageAlt = formData.get('imageAlt') as string;
    if (!imageAlt || imageAlt.trim() === '') {
      setError('Alt Text Gambar WAJIB diisi untuk kebutuhan SEO!');
      toast.error('Alt Text Gambar WAJIB diisi');
      setLoading(false);
      return;
    }

    if (!imageUrl) {
      setError('Gambar utama produk wajib diunggah');
      toast.error('Gambar utama produk wajib diunggah');
      setLoading(false);
      return;
    }

    try {
      const res = await createProductAction(formData);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success('Produk berhasil ditambahkan!');
        router.push('/id/admin/kelola-produk');
      }
    } catch {
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-dark-navy)]">Tambah Produk Baru</h1>
        <p className="text-sm text-slate-500">Masukkan detail alat kesehatan.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Nama Produk</label>
                <input
                  required name="name"
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                  placeholder="Contoh: Allchek COVID-19 Ag Rapid Test"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Merek</label>
                <select required name="brandId" className="w-full rounded-md border border-[var(--color-airy-blue)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]">
                  <option value="">Pilih Merek</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Deskripsi (ID)</label>
                <textarea required name="description_id" rows={4} className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Deskripsi (EN)</label>
                <textarea required name="description_en" rows={4} className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Spesifikasi (ID)</label>
                <textarea name="specs_id" rows={3} placeholder="Contoh: Format sampel: Serum/Plasma, Waktu hasil: 15 menit" className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Spesifikasi (EN)</label>
                <textarea name="specs_en" rows={3} placeholder="Example: Sample format: Serum/Plasma, Result time: 15 minutes" className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Gambar Utama */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Gambar Utama Produk <span className="text-red-500">*</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-accent-sky)] rounded-lg cursor-pointer bg-slate-50 hover:bg-[var(--color-airy-blue)] transition-colors relative overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 mb-2 text-[var(--color-primary-blue)]" />
                      <p className="text-xs text-slate-500">{uploadingImage ? 'Mengunggah...' : 'Klik untuk unggah (PNG/JPG)'}</p>
                    </div>
                  )}
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Alt Text Gambar (Wajib SEO) <span className="text-red-500">*</span>
                </label>
                <input
                  required name="imageAlt"
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                  placeholder="Contoh: Alat rapid test Allchek COVID-19 asli"
                />
                <p className="text-xs text-slate-500">Bantu mesin pencari Google memahami gambar ini.</p>
              </div>
            </CardContent>
          </Card>

          {/* Galeri Gambar Tambahan */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Galeri Gambar Tambahan
                </label>
                <p className="text-xs text-slate-500 mt-1">Maks 5 gambar (sudut berbeda / detail produk)</p>
              </div>

              {additionalImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {additionalImages.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt={`Gambar ${i + 1}`} className="h-full w-full object-cover rounded-lg border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(i)}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {additionalImages.length < 5 && (
                <label className="flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm text-slate-500">
                  <ImagePlus className="h-4 w-4" />
                  {uploadingAdditional ? 'Mengunggah...' : `Tambah Foto (${additionalImages.length}/5)`}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleAdditionalUpload}
                    disabled={uploadingAdditional}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Upload Brosur PDF */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Brosur / Spesifikasi Teknis (PDF)</label>
                <p className="text-xs text-slate-500 mt-1">Opsional: Dokumen untuk diunduh klien (Maks 5MB)</p>
              </div>

              {brochureUrl ? (
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-6 w-6 text-red-500 shrink-0" />
                    <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-primary-blue)] hover:underline truncate">
                      {brochureUrl.split('/').pop()}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBrochureUrl('')}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Hapus PDF"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm text-slate-500">
                  <FileText className="h-4 w-4" />
                  {uploadingBrochure ? 'Mengunggah...' : 'Pilih File PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleBrochureUpload}
                    disabled={uploadingBrochure}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading || uploadingImage || uploadingAdditional || uploadingBrochure}>
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Batal
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
