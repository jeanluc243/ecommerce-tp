import { ExternalLink } from 'lucide-react'
import { WhatsAppLogo } from '@/components/admin/whatsapp-logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '')
}

function createWhatsAppUrl(order) {
  const items = order.items.map((item) => `${item.productName ?? `Product #${item.productId}`} x${item.quantity}`).join(', ')
  const lines = [
    `Bonjour, votre commande #${order.id} a ete validee.`,
    `Montant: ${formatPrice(order.totalAmount)}.`,
    `Articles: ${items}.`,
  ]

  return `https://wa.me/${normalizePhone(order.customerPhone)}?text=${encodeURIComponent(lines.join(' '))}`
}

export function OrdersPanel({
  orders,
  isLoading,
  isValidating,
  error,
  onValidateOnWhatsApp,
}) {
  async function handleValidate(order) {
    const whatsappUrl = createWhatsAppUrl(order)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    await onValidateOnWhatsApp(order.id)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-[1.6rem] border border-zinc-200 bg-white/70" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95">
          <CardContent className="px-6 py-10 text-center text-sm text-zinc-500">
            No customer orders yet.
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="rounded-[1.75rem] border-zinc-200/80 bg-white/95">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl tracking-[-0.03em]">Order #{order.id}</CardTitle>
                <p className="mt-2 text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    order.status === 'VALIDATED_WHATSAPP'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }
                >
                  {order.status === 'VALIDATED_WHATSAPP' ? 'Validated on WhatsApp' : 'Pending'}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1.5">
                  {formatPrice(order.totalAmount)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <div className="rounded-[1.35rem] bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-500">Client phone</p>
                  <p className="mt-1 font-semibold text-zinc-950">{order.customerPhone}</p>
                  {order.validatedAt ? (
                    <>
                      <p className="mt-4 text-sm text-zinc-500">Validated at</p>
                      <p className="mt-1 font-semibold text-zinc-950">{formatDate(order.validatedAt)}</p>
                    </>
                  ) : null}
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-zinc-200 px-4 py-3">
                      <div>
                        <p className="font-medium text-zinc-950">{item.productName ?? `Product #${item.productId}`}</p>
                        <p className="text-sm text-zinc-500">Qty {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-zinc-950">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => handleValidate(order)}
                  disabled={isValidating}
                  className="rounded-xl bg-[#25D366] px-5 text-white hover:bg-[#20bd5a]"
                >
                  <WhatsAppLogo className="size-4" />
                  {order.status === 'VALIDATED_WHATSAPP' ? 'Reopen WhatsApp' : 'Validate on WhatsApp'}
                </Button>
                <a
                  href={createWhatsAppUrl(order)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Open conversation
                </a>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
