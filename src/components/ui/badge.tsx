import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary-blue)] text-white shadow hover:bg-[var(--color-dark-navy)]",
        secondary:
          "border-transparent bg-[var(--color-airy-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-accent-sky)]",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline: "text-[var(--color-dark-navy)] border-[var(--color-airy-blue)]",
        brand: "border-[var(--color-accent-sky)] bg-[var(--color-airy-blue)] text-[var(--color-dark-navy)]",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        draft: "border-slate-200 bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
