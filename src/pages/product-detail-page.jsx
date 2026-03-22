import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductVisual, formatPrice } from '@/components/store/store-shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { getProduct } from '@/services/api'

export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getProduct(id)
        if (!active) return
        setProduct(data)
      } catch (loadError) {
        if (!active) return
        setError(loadError.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50 p-10" />
  }

  if (error) {
    return <div className="p-10 text-red-700">{error}</div>
  }

  if (!product) {
    return <div className="p-10 text-zinc-600">Product not found.</div>
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600">
          <ArrowLeft className="size-4" />
          Back to store
        </Link>
        <Card className="overflow-hidden rounded-[2rem]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <ProductVisual imageUrl={product.imageUrl} title={product.name} index={0} className="h-[28rem] lg:h-full" />
            <CardContent className="flex flex-col justify-between p-8">
              <div className="space-y-5">
                <Badge variant="outline" className="rounded-md px-2 py-1 text-[11px] font-semibold">
                  {product.category}
                </Badge>
                <div>
                  <h1 className="text-4xl font-semibold tracking-[-0.05em]">{product.name}</h1>
                  <p className="mt-3 text-base text-zinc-500">{product.description}</p>
                </div>
                <div className="grid gap-4 rounded-2xl bg-zinc-50 p-5 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-zinc-500">Brand</p>
                    <p className="mt-1 font-semibold text-zinc-950">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Availability</p>
                    <p className="mt-1 font-semibold text-zinc-950">
                      {product.inStock ? `${product.stock} items in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-zinc-950">{formatPrice(product.price)}</span>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addItem(product, quantity)}
                    disabled={!product.inStock}
                  >
                    Add to cart
                  </Button>
                  <Link to="/checkout">
                    <Button
                      className="w-full"
                      onClick={() => addItem(product, quantity)}
                      disabled={!product.inStock}
                    >
                      Buy now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
