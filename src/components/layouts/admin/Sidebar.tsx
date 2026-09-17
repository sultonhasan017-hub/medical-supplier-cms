"use client";

import React from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FileText, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Produk', href: '/admin/kelola-produk', icon: Package },
    { name: 'Kelola Artikel', href: '/admin/kelola-blog', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--color-airy-blue)] bg-white transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <Link href="/admin/dashboard" className="mb-8 flex items-center pl-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--color-primary-blue)] text-white font-bold mr-3">
            SIM
          </div>
          <span className="self-center whitespace-nowrap text-xl font-bold text-[var(--color-dark-navy)]">
            CMS Admin
          </span>
        </Link>
        
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => {
            // Because of [locale] routing, pathname might be /id/admin/dashboard
            const isActive = pathname.includes(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg p-3 group transition-colors",
                    isActive
                      ? "bg-[var(--color-primary-blue)] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-[var(--color-airy-blue)] hover:text-[var(--color-dark-navy)]"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-[var(--color-primary-blue)]")} />
                  <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <LogoutButton variant="sidebar" />
        </div>
      </div>
    </aside>
  );
}
