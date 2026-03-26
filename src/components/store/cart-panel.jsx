import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/components/store/store-shared'
import { useCart } from '@/context/cart-context'

export function CartPanel() {
  const { items, itemCount, totalAmount, updateQuantity, removeItem } = useCart()

  return (
    <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Panier</CardTitle>
            <CardDescription>Verifiez vos articles avant de passer a la caisse.</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1.5">
            {itemCount} article{itemCount > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-500">
            Votre panier est vide.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="space-y-3 rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-950">{item.product.name}</p>
                  <p className="text-sm text-zinc-500">{formatPrice(item.product.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-zinc-400 transition hover:text-zinc-950"
                >
                  Retirer
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Input
                  type="number"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.product.id, event.target.value)}
                  className="w-24"
                />
                <span className="font-semibold text-zinc-950">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between gap-3 text-sm text-orange-100">
            <span>Total</span>
            <span className="text-xl font-semibold text-primary-foreground">{formatPrice(totalAmount)}</span>
          </div>
          <Link to="/checkout" className="mt-4 block">
            <Button className="w-full bg-white text-orange-700 hover:bg-orange-50" disabled={!items.length}>
              Passer la commande
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
