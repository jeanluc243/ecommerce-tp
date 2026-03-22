import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-black/20',
  {
    variants: {
      variant: {
        default: 'bg-zinc-950 text-white shadow-sm hover:bg-zinc-800',
        outline: 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
        ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 px-5',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
