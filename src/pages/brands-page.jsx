import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartPanel } from '@/components/store/cart-panel'
import { StoreShell } from '@/components/store/store-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getBrands } from '@/services/api'

export function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getBrands()
        if (!active) return
        setBrands(data)
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
  }, [])

  return (
    <StoreShell search="" onSearchChange={() => {}} aside={<CartPanel />}>
      <div className="space-y-6">
        <div>
          <Badge className="mb-4 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
            Explore
          </Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">Brands</h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-500">
            Navigate your catalog by brand and drill down into the corresponding products.
          </p>
        </div>

        <Separator />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded-[1.6rem] border border-zinc-200 bg-white/70" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => (
              <Card key={brand.name} className="rounded-[1.6rem] border-zinc-200/80">
                <CardContent className="space-y-4 p-6">
                  <Badge variant="outline" className="rounded-full px-3 py-1.5">
                    {brand.productCount} items
                  </Badge>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">{brand.name}</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      Browse products published under this brand.
                    </p>
                  </div>
                  {brand.sampleProductId ? (
                    <Link to={`/products/${brand.sampleProductId}`} className="text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline">
                      Open a product from this brand
                    </Link>
                  ) : (
                    <span className="text-sm text-zinc-400">No product linked yet</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  )
}
