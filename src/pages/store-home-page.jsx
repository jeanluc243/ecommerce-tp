import { useDeferredValue, useMemo, useState } from 'react'
import { CartPanel } from '@/components/store/cart-panel'
import { StoreProductCard } from '@/components/store/store-product-card'
import { StoreShell } from '@/components/store/store-shell'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useStoreProducts } from '@/hooks/use-store-products'

export function StoreHomePage() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const { products, isLoading, error } = useStoreProducts()

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      [product.name, product.description, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [deferredSearch, products])

  return (
    <StoreShell search={search} onSearchChange={setSearch} aside={<CartPanel />}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-4 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
              Nouvelle collection
            </Badge>
            <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">Jo Store</h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-500">
              Parcourez tous les articles, ouvrez une fiche produit et ajoutez vos selections au panier avant la commande.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1.5">
            {products.length} article{products.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <Separator />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[26rem] animate-pulse rounded-[1.6rem] border border-zinc-200 bg-white/70" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <StoreProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  )
}
