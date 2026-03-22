import { Link } from 'react-router-dom'
import { CartPanel } from '@/components/store/cart-panel'
import { StoreShell } from '@/components/store/store-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useStoreProducts } from '@/hooks/use-store-products'

export function BrandsPage() {
  const { products, isLoading, error } = useStoreProducts()

  const brands = Array.from(
    products.reduce((map, product) => {
      const brand = product.brand || 'Unknown brand'
      const current = map.get(brand) ?? { name: brand, count: 0, sampleId: product.id }
      current.count += 1
      map.set(brand, current)
      return map
    }, new Map()).values(),
  )

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
                    {brand.count} items
                  </Badge>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">{brand.name}</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      Browse products published under this brand.
                    </p>
                  </div>
                  <Link to={`/products/${brand.sampleId}`} className="text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline">
                    Open a product from this brand
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  )
}
