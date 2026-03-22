import { cn } from '@/lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex min-h-24 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900/10',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
