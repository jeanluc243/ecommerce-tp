import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice, ProductVisual } from '@/components/store/store-shared'
import { useCart } from '@/context/cart-context'

export function StoreProductCard({ product, index }) {
  const { addItem } = useCart()

  return (
    <Card className="overflow-hidden rounded-[1.6rem] border-zinc-200/80">
      <Link to={`/products/${product.id}`} className="block">
        <ProductVisual product={product} title={product.name} index={index} className="h-64 rounded-t-[1.6rem]" />
      </Link>
      <div className="space-y-4 p-5">
        <Badge variant="outline" className="rounded-md px-2 py-1 text-[11px] font-semibold">
          {product.category}
        </Badge>
        <div className="space-y-2">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-zinc-950">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-zinc-500">{product.description}</p>
          <p className="text-sm text-zinc-400">{product.brand}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-semibold text-zinc-950">{formatPrice(product.price)}</span>
          <Badge className={product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'}>
            {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <Link to={`/products/${product.id}`}>
            <Button variant="outline" className="w-full">View</Button>
          </Link>
          <Button
            className="w-full"
            onClick={() => addItem(product, 1)}
            disabled={!product.inStock}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </Card>
  )
}
