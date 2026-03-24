import { GripVertical, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  filesToProductMedia,
  getRemainingMediaSlots,
  MAX_PRODUCT_MEDIA,
  moveMediaItem,
  normalizeProductMedia,
} from '@/lib/product-media'

const initialValues = {
  name: '',
  description: '',
  category: '',
  brand: '',
  media: [],
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
    media: normalizeProductMedia(product),
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
  }
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isSaving,
  categories = [],
  brands = [],
}) {
  const [values, setValues] = useState(() => getProductValues(product))
  const [error, setError] = useState('')
  const [isDropzoneActive, setIsDropzoneActive] = useState(false)
  const [draggedMediaId, setDraggedMediaId] = useState(null)
  const fileInputRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function appendFiles(fileList) {
    const remainingSlots = getRemainingMediaSlots(values.media)

    if (remainingSlots === 0) {
      setError(`You can upload up to ${MAX_PRODUCT_MEDIA} images.`)
      return
    }

    try {
      const media = await filesToProductMedia(Array.from(fileList).slice(0, remainingSlots))

      if (media.length === 0) {
        setError('Only image files are supported.')
        return
      }

      setValues((current) => ({
        ...current,
        media: [...current.media, ...media],
      }))
      setError('')
    } catch (fileError) {
      setError(fileError.message)
    }
  }

  async function handleFileChange(event) {
    const { files } = event.target
    if (!files?.length) return

    await appendFiles(files)
    event.target.value = ''
  }

  async function handleDrop(event) {
    event.preventDefault()
    setIsDropzoneActive(false)
    const { files } = event.dataTransfer

    if (files?.length) {
      await appendFiles(files)
    }
  }

  function handleMediaDragStart(mediaId) {
    setDraggedMediaId(mediaId)
  }

  function handleMediaDrop(targetMediaId) {
    if (!draggedMediaId || draggedMediaId === targetMediaId) {
      setDraggedMediaId(null)
      return
    }

    setValues((current) => {
      const fromIndex = current.media.findIndex((item) => item.id === draggedMediaId)
      const toIndex = current.media.findIndex((item) => item.id === targetMediaId)

      return {
        ...current,
        media: moveMediaItem(current.media, fromIndex, toIndex),
      }
    })
    setDraggedMediaId(null)
  }

  function removeMedia(mediaId) {
    setValues((current) => ({
      ...current,
      media: current.media.filter((item) => item.id !== mediaId),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const result = await onSubmit(values, product)

    if (result?.ok) {
      setValues(initialValues)
      setError('')
    } else if (result?.message) {
      setError(result.message)
    }
  }

  const isEditing = Boolean(product)
  const remainingSlots = getRemainingMediaSlots(values.media)
  const hasCategoryOption = categories.some((category) => category.name === values.category)
  const hasBrandOption = brands.some((brand) => brand.name === values.brand)

  return (
    <Card className="rounded-[1.75rem] border-zinc-200/80 bg-white/95 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl tracking-[-0.03em]">
          {isEditing ? 'Edit product' : 'Add a product'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update product details and reorder the image gallery directly from the admin panel.'
            : 'Upload one or more product images, reorder them, and publish them instantly in the catalog.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input name="name" placeholder="Product name" value={values.name} onChange={handleChange} required />
          <Textarea
            name="description"
            placeholder="Short description"
            value={values.description}
            onChange={handleChange}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            >
              <option value="">Select category</option>
              {values.category && !hasCategoryOption ? (
                <option value={values.category}>{values.category}</option>
              ) : null}
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="brand"
              value={values.brand}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            >
              <option value="">Select brand</option>
              {values.brand && !hasBrandOption ? (
                <option value={values.brand}>{values.brand}</option>
              ) : null}
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-800">Product gallery</p>
                <p className="text-xs text-zinc-500">
                  Drop images here, click to browse, then drag thumbnails to reorder.
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {values.media.length}/{MAX_PRODUCT_MEDIA}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDropzoneActive(true)
              }}
              onDragLeave={() => setIsDropzoneActive(false)}
              onDrop={handleDrop}
              className={`flex min-h-36 w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed px-5 py-6 text-center transition ${
                isDropzoneActive
                  ? 'border-zinc-900 bg-zinc-950 text-white'
                  : 'border-zinc-300 bg-zinc-50 text-zinc-700'
              }`}
            >
              <Upload className="mb-3 size-6" />
              <span className="text-sm font-semibold">
                {remainingSlots > 0 ? 'Drop images or click to upload' : 'Gallery is full'}
              </span>
              <span className={`mt-1 text-xs ${isDropzoneActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                {remainingSlots > 0
                  ? `${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining`
                  : 'Remove an image to add a new one'}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {values.media.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {values.media.map((media, mediaIndex) => (
                  <div
                    key={media.id}
                    draggable
                    onDragStart={() => handleMediaDragStart(media.id)}
                    onDragEnd={() => setDraggedMediaId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleMediaDrop(media.id)}
                    className={`overflow-hidden rounded-[1.35rem] border bg-white ${
                      draggedMediaId === media.id ? 'border-zinc-900 shadow-lg' : 'border-zinc-200'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={media.src}
                        alt={media.name}
                        className="h-36 w-full object-cover"
                      />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                        <GripVertical className="size-3.5" />
                        {mediaIndex === 0 ? 'Cover' : `Image ${mediaIndex + 1}`}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">{media.name}</p>
                        <p className="text-xs text-zinc-500">{media.mimeType}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedia(media.id)}
                        aria-label={`Remove ${media.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
                <div className="flex items-center gap-3">
                  <ImagePlus className="size-4" />
                  The first uploaded image becomes the product cover.
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input name="price" placeholder="Price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} required />
            <Input name="stock" placeholder="Stock" type="number" min="0" step="1" value={values.stock} onChange={handleChange} />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

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
