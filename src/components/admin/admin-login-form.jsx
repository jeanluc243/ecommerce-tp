import { LockKeyhole, Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminLoginForm({ onSubmit, isSubmitting, error }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit({
      phone: phone.trim(),
      password,
    })
  }

  return (
    <Card className="w-full max-w-md rounded-[2rem] border-zinc-200/80 bg-white/95">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl tracking-[-0.05em]">Admin login</CardTitle>
        <CardDescription>
          `/admin` is protected. Enter the admin phone number and password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Phone number</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="243..."
                className="pl-9"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                className="pl-9"
                required
              />
            </div>
          </div>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Connecting...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
