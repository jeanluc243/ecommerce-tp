import { LogOut, Search, ShoppingBag, MoonStar, PanelTopOpen } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { ProductCard } from '@/components/admin/product-card'
import { ProductForm } from '@/components/admin/product-form'
import { StoreNav } from '@/components/store/store-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useAdminProducts } from '@/hooks/use-admin-products'
import { clearAdminToken, hasAdminToken, setAdminToken } from '@/lib/admin-auth'
import { loginAdmin } from '@/services/api'

export function AdminPage() {
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const deferredSearch = useDeferredValue(search)
  const {
    products,
    isLoading,
    isSaving,
    isDeleting,
    error,
    addProduct,
    editProduct,
    removeProduct,
  } = useAdminProducts(isAuthenticated)

  useEffect(() => {
    setIsAuthenticated(hasAdminToken())
  }, [])

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      [product.name, product.description, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [deferredSearch, products])

  async function handleSubmit(values, product) {
    if (product) {
      const result = await editProduct(product.id, values)
      if (result.ok) {
        setSelectedProduct(null)
      }
      return result
    }

    return addProduct(values)
  }

  async function handleDelete(product) {
    const shouldDelete = window.confirm(`Delete "${product.name}"?`)
    if (!shouldDelete) return

    const result = await removeProduct(product.id)
    if (result.ok && selectedProduct?.id === product.id) {
      setSelectedProduct(null)
    }
  }

  async function handleLogin(credentials) {
    setIsSubmittingAuth(true)
    setAuthError('')

    try {
      const response = await loginAdmin(credentials)
      setAdminToken(response.token)
      setIsAuthenticated(true)
    } catch (loginError) {
      setAuthError(loginError.message)
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  function handleLogout() {
    clearAdminToken()
    setSelectedProduct(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,244,245,0.92)_40%,_rgba(228,228,231,0.65)_100%)] px-6 py-10">
        <AdminLoginForm
          onSubmit={handleLogin}
          isSubmitting={isSubmittingAuth}
          error={authError}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,244,245,0.92)_40%,_rgba(228,228,231,0.65)_100%)] text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold tracking-[-0.04em]">Store</Link>
            <StoreNav />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-72 rounded-xl bg-zinc-50 pl-9"
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Open admin">
              <ShoppingBag className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Toggle theme">
              <MoonStar className="size-4" />
            </Button>
            <Button className="rounded-xl px-5" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="mb-4 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
                  Admin dashboard
                </Badge>
                <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">
                  Products
                </h1>
                <p className="mt-3 max-w-2xl text-base text-zinc-500">
                  Manage your catalog with an admin page built around a product-first layout and a clean shadcn-style component system.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="rounded-full px-3 py-1.5">
                  {products.length} items
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1.5">
                  Express MVP
                </Badge>
              </div>
            </div>

            <Separator />

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-[25rem] animate-pulse rounded-[1.6rem] border border-zinc-200 bg-white/70" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isActive={selectedProduct?.id === product.id}
                    isDeleting={isDeleting}
                    onEdit={setSelectedProduct}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/70 px-6 py-12 text-center">
                <PanelTopOpen className="mx-auto mb-4 size-8 text-zinc-400" />
                <h2 className="text-xl font-semibold tracking-[-0.03em]">No products found</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Adjust your search or create a new item from the admin panel.
                </p>
              </div>
            ) : null}
          </div>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <ProductForm
              product={selectedProduct}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedProduct(null)}
              isSaving={isSaving}
            />
          </aside>
        </section>
      </main>
    </div>
  )
}
