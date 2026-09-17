'use client';

import { Check, Link as LinkIcon } from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ShareBarProps {
  title: string;
}

export default function ShareBar({ title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: 'facebook' | 'whatsapp' | 'instagram') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
      // Mengarahkan ke profil Instagram perusahaan sesuai dengan yang ada di Footer
      instagram: `https://www.instagram.com/simcorp.id/`, 
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-dark-navy)]">Bagikan Artikel Ini</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 text-slate-500 hover:text-[#1877F2] hover:border-[#1877F2]"
            onClick={() => handleShare('facebook')}
            title="Bagikan ke Facebook"
          >
            <FaFacebook className="h-4 w-4" />
            <span className="sr-only">Share to Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 text-slate-500 hover:text-[#25D366] hover:border-[#25D366]"
            onClick={() => handleShare('whatsapp')}
            title="Bagikan ke WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4" />
            <span className="sr-only">Share to WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 text-slate-500 hover:text-[#E1306C] hover:border-[#E1306C]"
            onClick={() => handleShare('instagram')}
            title="Buka Instagram"
          >
            <FaInstagram className="h-4 w-4" />
            <span className="sr-only">Open Instagram</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-10 w-10 transition-colors ${
              copied
                ? 'text-emerald-500 border-emerald-500'
                : 'text-slate-500 hover:text-[var(--color-primary-blue)] hover:border-[var(--color-primary-blue)]'
            }`}
            onClick={handleCopyLink}
            title={copied ? 'Link tersalin!' : 'Salin link artikel'}
          >
            {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            <span className="sr-only">{copied ? 'Tersalin!' : 'Copy Link'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
