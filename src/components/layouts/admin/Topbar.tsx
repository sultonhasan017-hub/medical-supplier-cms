import React from 'react';
import { User } from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-airy-blue)] bg-white px-6 shadow-sm">
      <div className="flex items-center">
        {/* Mobile menu button would go here */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-airy-blue)] text-[var(--color-primary-blue)]">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-[var(--color-dark-navy)]">Administrator</span>
            <span className="text-xs text-slate-500">Super Admin</span>
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>
        
        <LogoutButton variant="icon" />
      </div>
    </header>
  );
}
