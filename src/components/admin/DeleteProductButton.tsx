"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Trash2 } from 'lucide-react';
import { deleteProductAction } from '@/app/[locale]/admin/kelola-produk/buat/actions';
import { toast } from 'sonner';

export function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    const res = await deleteProductAction(id);
    if (res?.error) {
      toast.error(res.error);
      setIsDeleting(false);
      setShowDialog(false);
    } else {
      toast.success(`Produk "${name}" berhasil dihapus`);
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => setShowDialog(true)}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Hapus Produk"
        message={`Anda akan menghapus produk "${name}". Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
