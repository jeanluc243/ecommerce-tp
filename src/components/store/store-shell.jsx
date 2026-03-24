import { Search, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StoreNav } from '@/components/store/store-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'

export function StoreShell({ search, onSearchChange, children, aside }) {
  const { itemCount } = useCart()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,244,245,0.92)_40%,_rgba(228,228,231,0.65)_100%)] text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold tracking-[-0.04em]">
              Boutique
            </Link>
            <StoreNav />
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-72 rounded-xl bg-zinc-50 pl-9"
                />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/checkout">
              <Button variant="outline" className="rounded-xl">
                <ShoppingBag className="size-4" />
                Panier ({itemCount})
              </Button>
            </Link>
            <Link to="/admin">
              <Button className="rounded-xl px-5">Administration</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10">
        {aside ? (
          <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div>{children}</div>
            <aside className="xl:sticky xl:top-28 xl:self-start">{aside}</aside>
          </section>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
