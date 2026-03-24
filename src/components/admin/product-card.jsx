import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { normalizeProductMedia } from '@/lib/product-media'

const placeholderGradients = [
  'from-zinc-800 via-zinc-700 to-zinc-900',
  'from-stone-200 via-zinc-100 to-stone-300',
  'from-slate-300 via-zinc-400 to-slate-500',
  'from-sky-100 via-blue-100 to-slate-200',
  'from-amber-200 via-orange-100 to-stone-100',
  'from-neutral-200 via-zinc-300 to-neutral-400',
]

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

function ProductImage({ product, title, index }) {
  const media = normalizeProductMedia(product)
  const coverImage = media[0]?.src

  if (coverImage) {
    return (
      <div className="relative">
        <img
          src={coverImage}
          alt={title}
          className="h-60 w-full rounded-t-2xl object-cover"
        />
        {media.length > 1 ? (
          <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            +{media.length - 1}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={`flex h-60 w-full items-end rounded-t-2xl bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]} p-5`}
    >
      <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur">
        {title}
      </div>
    </div>
  )
}

export function ProductCard({
  product,
  index,
  isActive,
  isDeleting,
  onEdit,
  onDelete,
}) {
  return (
    <Card
      className={`overflow-hidden rounded-[1.6rem] border-zinc-200/80 ${isActive ? 'ring-2 ring-zinc-900/10' : ''}`}
    >
      <ProductImage product={product} title={product.name} index={index} />
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className="rounded-md px-2 py-1 text-[11px] font-semibold">
            {product.category}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}>
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(product)}
              disabled={isDeleting}
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-zinc-950">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">{product.description}</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">{product.brand}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant={product.inStock ? 'default' : 'secondary'}
            className={product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'}
          >
            {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
          <span className="text-xl font-semibold text-zinc-950">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Card>
  )
}
