import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const initialValues = {
  name: '',
  description: '',
  category: '',
  brand: '',
  imageUrl: '',
  price: '',
  stock: '',
}

function getProductValues(product) {
  if (!product) return initialValues

  return {
    name: product.name ?? '',
    description: product.description ?? '',
    category: product.category ?? '',
    brand: product.brand ?? '',
    imageUrl: product.imageUrl ?? '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
  }
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isSaving,
}) {
  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    setValues(getProductValues(product))
  }, [product])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const result = await onSubmit(values, product)

    if (result?.ok) {
      setValues(initialValues)
    }
  }

  const isEditing = Boolean(product)

  return (
    <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl tracking-[-0.03em]">
          {isEditing ? 'Edit product' : 'Add a product'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update an existing product directly from the admin panel.'
            : 'Create catalog items from the admin panel and publish them instantly in the grid.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input name="name" placeholder="Product name" value={values.name} onChange={handleChange} required />
          <Textarea
            name="description"
            placeholder="Short description"
            value={values.description}
            onChange={handleChange}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="category" placeholder="Category" value={values.category} onChange={handleChange} />
            <Input name="brand" placeholder="Brand" value={values.brand} onChange={handleChange} />
          </div>
          <Input name="imageUrl" placeholder="Image URL" value={values.imageUrl} onChange={handleChange} />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="price" placeholder="Price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} required />
            <Input name="stock" placeholder="Stock" type="number" min="0" step="1" value={values.stock} onChange={handleChange} />
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditing ? 'Update product' : 'Create product'}
            </Button>
            {isEditing ? (
              <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
