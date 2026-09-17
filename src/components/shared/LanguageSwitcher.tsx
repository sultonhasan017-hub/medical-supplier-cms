"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'id' ? 'en' : 'id';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors"
      onClick={toggleLocale}
      disabled={isPending}
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="font-semibold uppercase">{locale}</span>
    </Button>
  );
}
