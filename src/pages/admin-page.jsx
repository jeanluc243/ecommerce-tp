import {
  Layers3,
  LogOut,
  MessageSquareText,
  MoonStar,
  Package2,
  Search,
  Shapes,
  ShoppingBag,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { OrdersPanel } from '@/components/admin/orders-panel'
import { ProductCard } from '@/components/admin/product-card'
import { ProductForm } from '@/components/admin/product-form'
import { TaxonomyManager } from '@/components/admin/taxonomy-manager'
import { StoreNav } from '@/components/store/store-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAdminOrders } from '@/hooks/use-admin-orders'
import { useAdminProducts } from '@/hooks/use-admin-products'
import { useAdminTaxonomy } from '@/hooks/use-admin-taxonomy'
import { clearAdminToken, hasAdminToken, setAdminToken } from '@/lib/admin-auth'
import { loginAdmin } from '@/services/api'

const adminTabs = [
  { id: 'products', label: 'Produits', icon: Package2 },
  { id: 'categories', label: 'Categories', icon: Layers3 },
  { id: 'brands', label: 'Marques', icon: Shapes },
  { id: 'orders', label: 'Commandes', icon: MessageSquareText },
]

export function AdminPage() {
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const deferredSearch = useDeferredValue(search)
  const {
    products,
    isLoading: isLoadingProducts,
    isSaving: isSavingProduct,
    isDeleting: isDeletingProduct,
    error: productsError,
    addProduct,
    editProduct,
    removeProduct,
  } = useAdminProducts(isAuthenticated)
  const {
    categories,
    brands,
    isLoading: isLoadingTaxonomy,
    isSaving: isSavingTaxonomy,
    isDeleting: isDeletingTaxonomy,
    error: taxonomyError,
    addCategory,
    editCategory,
    removeCategory,
    addBrand,
    editBrand,
    removeBrand,
  } = useAdminTaxonomy(isAuthenticated)
  const {
    orders,
    isLoading: isLoadingOrders,
    isValidating,
    error: ordersError,
    validateOnWhatsApp,
  } = useAdminOrders(isAuthenticated)

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
    const shouldDelete = window.confirm(`Supprimer "${product.name}" ?`)
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

  function getPageMeta() {
    switch (activeTab) {
      case 'categories':
        return {
          title: 'Categories',
          description: 'Creez et maintenez la liste des categories utilisees par votre catalogue.',
          stat: `${categories.length} categorie${categories.length > 1 ? 's' : ''}`,
        }
      case 'brands':
        return {
          title: 'Marques',
          description: 'Gerez les marques disponibles lors de la creation ou de la modification des produits.',
          stat: `${brands.length} marque${brands.length > 1 ? 's' : ''}`,
        }
      case 'orders':
        return {
          title: 'Commandes',
          description: 'Consultez les commandes clients et validez-les directement depuis WhatsApp.',
          stat: `${orders.length} commande${orders.length > 1 ? 's' : ''}`,
        }
      default:
        return {
          title: 'Produits',
          description: 'Gerez votre catalogue avec une interface d\'administration orientee produit et une presentation claire.',
          stat: `${products.length} article${products.length > 1 ? 's' : ''}`,
        }
    }
  }

  const pageMeta = getPageMeta()

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
            <Link to="/" className="text-lg font-bold tracking-[-0.04em]">Jo Store</Link>
            <StoreNav />
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'products' ? (
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-72 rounded-xl bg-zinc-50 pl-9"
                />
              </div>
            ) : null}
            <Button variant="outline" size="icon" aria-label="Ouvrir l'administration">
              <ShoppingBag className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Changer le theme">
              <MoonStar className="size-4" />
            </Button>
            <Button className="rounded-xl px-5" onClick={handleLogout}>
              <LogOut className="size-4" />
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-4 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
                Tableau de bord
              </Badge>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">
                {pageMeta.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-zinc-500">
                {pageMeta.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1.5">
                {pageMeta.stat}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1.5">
                Express MVP
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = tab.id === activeTab

              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  className="rounded-full px-4"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          <Separator />
        </section>

        {activeTab === 'products' ? (
          <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {productsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {productsError}
                </div>
              ) : null}

              {isLoadingProducts || isLoadingTaxonomy ? (
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
                      isDeleting={isDeletingProduct}
                      onEdit={setSelectedProduct}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}

              {!isLoadingProducts && filteredProducts.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/70 px-6 py-12 text-center text-sm text-zinc-500">
                  Aucun produit trouve.
                </div>
              ) : null}
            </div>

            <aside className="xl:sticky xl:top-28 xl:self-start">
              <ProductForm
                key={selectedProduct?.id ?? 'new-product'}
                product={selectedProduct}
                onSubmit={handleSubmit}
                onCancel={() => setSelectedProduct(null)}
                isSaving={isSavingProduct}
                categories={categories}
                brands={brands}
              />
            </aside>
          </section>
        ) : null}

        {activeTab === 'categories' ? (
          isLoadingTaxonomy ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="h-80 animate-pulse rounded-[1.75rem] border border-zinc-200 bg-white/70" />
              <div className="h-80 animate-pulse rounded-[1.75rem] border border-zinc-200 bg-white/70" />
            </div>
          ) : (
            <TaxonomyManager
              title="Categories"
              description="Ces categories apparaissent dans le formulaire produit de l'administration et sur la page categories de la boutique."
              items={categories}
              itemLabel="categorie"
              isSaving={isSavingTaxonomy}
              isDeleting={isDeletingTaxonomy}
              onCreate={addCategory}
              onUpdate={editCategory}
              onDelete={removeCategory}
            />
          )
        ) : null}

        {activeTab === 'brands' ? (
          isLoadingTaxonomy ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="h-80 animate-pulse rounded-[1.75rem] border border-zinc-200 bg-white/70" />
              <div className="h-80 animate-pulse rounded-[1.75rem] border border-zinc-200 bg-white/70" />
            </div>
          ) : (
            <TaxonomyManager
              title="Marques"
              description="Gerez le repertoire des marques utilise dans le formulaire produit de l'administration et sur la page marques de la boutique."
              items={brands}
              itemLabel="marque"
              isSaving={isSavingTaxonomy}
              isDeleting={isDeletingTaxonomy}
              onCreate={addBrand}
              onUpdate={editBrand}
              onDelete={removeBrand}
            />
          )
        ) : null}

        {activeTab === 'orders' ? (
          <OrdersPanel
            orders={orders}
            isLoading={isLoadingOrders}
            isValidating={isValidating}
            error={ordersError}
            onValidateOnWhatsApp={validateOnWhatsApp}
          />
        ) : null}

        {(activeTab === 'categories' || activeTab === 'brands') && taxonomyError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {taxonomyError}
          </div>
        ) : null}
      </main>
    </div>
  )
}
