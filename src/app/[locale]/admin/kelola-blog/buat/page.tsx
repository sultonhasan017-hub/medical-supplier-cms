"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, X, ImagePlus } from 'lucide-react';
import { createBlogAction } from './actions';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function FormBlog() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for ID
  const [metaDescId, setMetaDescId] = useState('');
  const [contentId, setContentId] = useState('');
  // State for EN
  const [metaDescEn, setMetaDescEn] = useState('');
  const [contentEn, setContentEn] = useState('');
  
  const [activeTab, setActiveTab] = useState<'ID' | 'EN'>('ID');

  // Image states
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingThumbnail(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setThumbnailUrl(data.url);
        toast.success('Thumbnail artikel berhasil diunggah');
      } else {
        toast.error('Gagal mengunggah thumbnail');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah');
    } finally {
      setUploadingThumbnail(false);
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
        toast.success('Gambar galeri berhasil diunggah');
      } else {
        toast.error('Gagal mengunggah gambar galeri');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah');
    } finally {
      setUploadingAdditional(false);
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
    formData.set('content_id', contentId);
    formData.set('content_en', contentEn);
    formData.append('thumbnailUrl', thumbnailUrl);
    formData.append('additionalImages', JSON.stringify(additionalImages));
    
    try {
      const res = await createBlogAction(formData);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success('Artikel berhasil dipublikasikan!');
        router.push('/id/admin/kelola-blog');
      }
    } catch {
      toast.error('Terjadi kesalahan tak terduga saat menyimpan artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-dark-navy)]">Tulis Artikel Baru</h1>
        <p className="text-sm text-slate-500">Buat konten edukatif dan berita seputar dunia medis.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button type="button" variant={activeTab === 'ID' ? 'default' : 'outline'} onClick={() => setActiveTab('ID')}>
              Bahasa Indonesia
            </Button>
            <Button type="button" variant={activeTab === 'EN' ? 'default' : 'outline'} onClick={() => setActiveTab('EN')}>
              English
            </Button>
          </div>
          
          <Card className={activeTab === 'ID' ? 'block' : 'hidden'}>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Judul Artikel (ID)</label>
                <input required={activeTab === 'ID'} name="title_id" className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" placeholder="Masukkan judul menarik" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Konten Artikel (ID)</label>
                <div className="bg-white">
                  <RichTextEditor 
                    value={contentId} 
                    onChange={setContentId} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Meta Description (SEO - ID)</label>
                   <span className={`text-xs ${metaDescId.length > 160 ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                     {metaDescId.length}/160
                   </span>
                </div>
                <textarea 
                  required={activeTab === 'ID'} 
                  name="metaDesc_id" 
                  rows={3} 
                  maxLength={160}
                  value={metaDescId}
                  onChange={(e) => setMetaDescId(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
                  placeholder="Ringkasan artikel untuk pencarian Google..." 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className={activeTab === 'EN' ? 'block' : 'hidden'}>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Article Title (EN)</label>
                <input required={activeTab === 'EN'} name="title_en" className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" placeholder="Enter an engaging title" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Article Content (EN)</label>
                <div className="bg-white">
                  <RichTextEditor 
                    value={contentEn} 
                    onChange={setContentEn} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-semibold text-[var(--color-dark-navy)]">Meta Description (SEO - EN)</label>
                   <span className={`text-xs ${metaDescEn.length > 160 ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                     {metaDescEn.length}/160
                   </span>
                </div>
                <textarea 
                  required={activeTab === 'EN'} 
                  name="metaDesc_en" 
                  rows={3} 
                  maxLength={160}
                  value={metaDescEn}
                  onChange={(e) => setMetaDescEn(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" 
                  placeholder="Article summary for Google search..." 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Gambar Thumbnail Utama */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Thumbnail Utama Artikel
                </label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[var(--color-accent-sky)] rounded-lg cursor-pointer bg-slate-50 hover:bg-[var(--color-airy-blue)] transition-colors relative overflow-hidden">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail Preview" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 mb-2 text-[var(--color-primary-blue)]" />
                      <p className="text-xs text-slate-500">{uploadingThumbnail ? 'Mengunggah...' : 'Klik unggah gambar (PNG/JPG)'}</p>
                    </div>
                  )}
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleThumbnailUpload} />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Alt Text Thumbnail (SEO)
                </label>
                <input
                  name="thumbnailAlt"
                  className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]"
                  placeholder="Contoh: Kalibrasi alat medis di rumah sakit"
                />
              </div>
            </CardContent>
          </Card>

          {/* Galeri Gambar Pendukung */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">
                  Galeri Foto Tambahan
                </label>
                <p className="text-xs text-slate-500 mt-1">Maks 5 foto untuk melengkapi artikel</p>
              </div>

              {additionalImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {additionalImages.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt={`Galeri ${i + 1}`} className="h-full w-full object-cover rounded-lg border border-slate-200" />
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

          {/* URL Slug */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-dark-navy)]">URL Slug</label>
                <input name="slug" className="w-full rounded-md border border-[var(--color-airy-blue)] px-3 py-2 text-sm focus:border-[var(--color-primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-blue)]" placeholder="contoh-url-artikel" />
                <p className="text-xs text-slate-500">Dikosongkan akan generate otomatis dari judul (ID).</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading || uploadingThumbnail || uploadingAdditional}>
              {loading ? 'Menyimpan...' : 'Publikasikan Artikel'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
              Batal
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
