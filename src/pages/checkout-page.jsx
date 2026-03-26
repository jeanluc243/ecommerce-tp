import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/components/store/store-shared'
import { useCart } from '@/context/cart-context'
import { createOrder } from '@/services/api'

export function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerCode, setCustomerCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const order = await createOrder({
        customerPhone,
        customerCode,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      })

      clearCart()
      setSuccessMessage(`Commande n°${order.id} creee avec succes.`)
      setTimeout(() => navigate('/'), 1200)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="text-3xl tracking-[-0.04em]">Paiement</CardTitle>
            <CardDescription>
              Entrez votre numero de telephone et un code a 4 chiffres avant de confirmer l'achat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div> : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Numero de telephone</label>
                <Input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value.replace(/\D/g, ''))}
                  placeholder="243..."
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Code a 4 chiffres</label>
                <Input
                  value={customerCode}
                  onChange={(event) => setCustomerCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  inputMode="numeric"
                  maxLength={4}
                  required
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Button type="submit" className="w-full" disabled={!items.length || isSubmitting}>
                  {isSubmitting ? 'Commande en cours...' : 'Confirmer l\'achat'}
                </Button>
                <Link to="/">
                  <Button type="button" variant="outline" className="w-full">
                    Continuer les achats
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem]">
          <CardHeader>
            <CardTitle>Resume de la commande</CardTitle>
            <CardDescription>{items.length} ligne{items.length > 1 ? 's' : ''} dans votre panier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-500">
                Aucun article dans le panier.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4">
                  <div>
                    <p className="font-semibold text-zinc-950">{item.product.name}</p>
                    <p className="text-sm text-zinc-500">Qté {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-zinc-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))
            )}
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <div className="flex items-center justify-between text-sm text-orange-100">
                <span>Montant total</span>
                <span className="text-xl font-semibold text-primary-foreground">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
