/* eslint-disable react-refresh/only-export-components */
import { getPrimaryProductImage } from '@/lib/product-media'

export const placeholderGradients = [
  'from-zinc-800 via-zinc-700 to-zinc-900',
  'from-stone-200 via-zinc-100 to-stone-300',
  'from-slate-300 via-zinc-400 to-slate-500',
  'from-sky-100 via-blue-100 to-slate-200',
  'from-amber-200 via-orange-100 to-stone-100',
  'from-neutral-200 via-zinc-300 to-neutral-400',
]

export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function ProductVisual({ product, imageUrl, title, index, className = 'h-72' }) {
  const primaryImage = product ? getPrimaryProductImage(product) : imageUrl

  if (primaryImage) {
    return (
      <img
        src={primaryImage}
        alt={title}
        className={`${className} w-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`flex ${className} w-full items-end bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]} p-6`}
    >
      <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur">
        {title}
      </div>
    </div>
  )
}
