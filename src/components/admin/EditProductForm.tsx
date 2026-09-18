'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateProductAction } from '../../app/[locale]/admin/kelola-produk/[id]/edit/actions';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, X, ImagePlus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  description_id: string;
  description_en: string;
  specs_id?: string | null;
  specs_en?: string | null;
  imageUrl: string;
  imageAlt: string;
  additionalImages: string[];
  brochureUrl?: string | null;
  brandId: string;
  brand: { id: string; name: string };
}

interface EditProductFormProps {
  product: Product;
  brands: { id: string; name: string }[];
}

export default function EditProductForm({ product, brands }: EditProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(product.additionalImages || []);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState(product.brochureUrl || '');
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

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
        toast.success('Gambar utama berhasil diganti');
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

    try {
      const res = await updateProductAction(product.id, formData);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success('Produk berhasil diperbarui!');
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
        <h1 className="text-2xl font-bold text-[var(--color-dark-navy)]">Edit Produk</h1>
        <p className="text-sm text-slate-500">Perbarui informasi produk: <span className="font-medium text-[var(--color-primary-blue)]">{product.name}</span></p>
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
                  defaultValue={product.name}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Merek</label>
                <select
                  required name="brandId"
                  defaultValue={product.brandId}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] bg-white px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Deskripsi (ID)</label>
                <textarea
                  required name="description_id"
                  defaultValue={product.description_id}
                  rows={4}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Deskripsi (EN)</label>
                <textarea
                  required name="description_en"
                  defaultValue={product.description_en}
                  rows={4}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Spesifikasi (ID)</label>
                <textarea
                  name="specs_id"
                  defaultValue={product.specs_id || ''}
                  rows={3}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Spesifikasi (EN)</label>
                <textarea
                  name="specs_en"
                  defaultValue={product.specs_en || ''}
                  rows={3}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Gambar Utama */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Gambar Utama Produk</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[var(--color-accent-sky)] rounded-lg cursor-pointer bg-slate-50 hover:bg-[var(--color-airy-blue)] transition-colors relative overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <div className="text-white text-center">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">{uploadingImage ? 'Mengunggah...' : 'Klik untuk ganti'}</p>
                    </div>
                  </div>
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Alt Text Gambar (Wajib SEO) <span className="text-red-500">*</span>
                </label>
                <input
                  required name="imageAlt"
                  defaultValue={product.imageAlt}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Galeri Tambahan */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Galeri Gambar Tambahan</label>
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
                <p className="text-xs text-slate-500 mt-1">Opsional: Dokumen untuk diunduh klien (Maks 4.5MB)</p>
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
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
