import { cn } from '@/lib/utils'

function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/10',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
