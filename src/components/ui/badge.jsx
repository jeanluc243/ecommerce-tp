import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-zinc-200 bg-zinc-50 text-zinc-700',
        secondary: 'border-transparent bg-zinc-950 text-white',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'border-zinc-200 text-zinc-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
