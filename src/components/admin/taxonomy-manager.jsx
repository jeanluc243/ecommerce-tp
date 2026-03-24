import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function TaxonomyManager({
  title,
  description,
  items,
  itemLabel,
  isSaving,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [name, setName] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [error, setError] = useState('')

  function handleSelect(item) {
    setSelectedItem(item)
    setName(item.name)
    setError('')
  }

  function handleCancel() {
    setSelectedItem(null)
    setName('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const result = selectedItem
      ? await onUpdate(selectedItem.id, { name })
      : await onCreate({ name })

    if (result?.ok) {
      setName('')
      setSelectedItem(null)
    } else if (result?.message) {
      setError(result.message)
    }
  }

  async function handleDelete(item) {
    const shouldDelete = window.confirm(`Supprimer "${item.name}" ?`)
    if (!shouldDelete) return

    const result = await onDelete(item.id)
    if (result?.ok && selectedItem?.id === item.id) {
      handleCancel()
    } else if (result?.message) {
      setError(result.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-2xl tracking-[-0.04em]">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-[1.35rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-500">
              Aucun element pour le moment.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[1.35rem] border p-4 transition ${
                    selectedItem?.id === item.id ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className={`mt-2 text-sm ${selectedItem?.id === item.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {item.productCount} produit{item.productCount > 1 ? 's' : ''} lie{item.productCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleSelect(item)}
                        className={selectedItem?.id === item.id ? 'border-white/30 bg-white/10 text-white hover:bg-white/20' : ''}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className={selectedItem?.id === item.id ? 'border-white/30 bg-white/10 text-white hover:bg-white/20' : ''}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-xl tracking-[-0.03em]">
            {selectedItem ? `Modifier ${itemLabel}` : `Ajouter ${itemLabel}`}
          </CardTitle>
          <CardDescription>
            {selectedItem
              ? `Renommez le ${itemLabel} selectionne.`
              : `Creez un nouveau ${itemLabel} disponible dans le formulaire produit.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`Nom du ${itemLabel}`}
              required
            />
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            <div className="grid gap-2 md:grid-cols-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : selectedItem ? 'Mettre a jour' : 'Creer'}
              </Button>
              {selectedItem ? (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
