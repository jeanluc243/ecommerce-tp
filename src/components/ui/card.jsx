import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-[0_12px_40px_-24px_rgba(24,24,27,0.28)]',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-zinc-500', className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
