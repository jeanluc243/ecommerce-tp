import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const storeNavigation = [
  { label: 'Store', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'Brands', to: '/brands' },
]

export function StoreNav() {
  const location = useLocation()

  return (
    <nav className="hidden items-center gap-2 md:flex">
      {storeNavigation.map((item) => {
        const isActive =
          item.to === '/'
            ? location.pathname === '/' || location.pathname === '/store'
            : location.pathname === item.to

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950',
              isActive && 'bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
