"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Trash2 } from 'lucide-react';
import { deleteBlogAction } from '@/app/[locale]/admin/kelola-blog/buat/actions';
import { toast } from 'sonner';

export function DeleteBlogButton({ id, title }: { id: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    const res = await deleteBlogAction(id);
    if (res?.error) {
      toast.error(res.error);
      setIsDeleting(false);
      setShowDialog(false);
    } else {
      toast.success(`Artikel "${title}" berhasil dihapus`);
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
        title="Hapus Artikel"
        message={`Anda akan menghapus artikel "${title}". Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
