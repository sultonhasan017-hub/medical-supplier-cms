import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "@/app/globals.css";

import { Toaster } from 'sonner';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  console.log("LocaleLayout locale:", locale);
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    console.log("LocaleLayout notFound triggered because locale is not valid:", locale);
    notFound();
  }
  
  // Perlu dipanggil di setiap layout/page untuk next-intl static rendering di Next.js 15
  const { setRequestLocale } = await import('next-intl/server');
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
