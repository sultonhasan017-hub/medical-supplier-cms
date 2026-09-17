'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface LogoutButtonProps {
  variant?: 'icon' | 'sidebar';
}

export function LogoutButton({ variant = 'icon' }: LogoutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        window.location.href = '/id/admin/login';
      }
    } catch {
      window.location.href = '/id/admin/login';
    }
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex w-full items-center rounded-lg p-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm group"
        >
          <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
          <span className="ml-3 flex-1 text-left whitespace-nowrap">Keluar (Logout)</span>
        </button>

        <ConfirmDialog
          isOpen={showConfirm}
          title="Konfirmasi Keluar"
          message="Apakah Anda yakin ingin keluar dari sesi admin CMS?"
          confirmLabel="Ya, Keluar"
          cancelLabel="Batal"
          loadingLabel="Keluar..."
          isLoading={loading}
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => setShowConfirm(true)}
        className="text-slate-500 hover:text-red-500 hover:bg-red-50"
        title="Keluar"
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Logout</span>
      </Button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sesi admin CMS?"
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        loadingLabel="Keluar..."
        isLoading={loading}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
