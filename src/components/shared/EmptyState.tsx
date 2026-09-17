import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent-sky)] bg-white p-8 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-[var(--color-airy-blue)] p-4 text-[var(--color-primary-blue)]">
        <SearchX className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-[var(--color-dark-navy)]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
