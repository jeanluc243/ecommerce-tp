const MAX_PRODUCT_MEDIA = 8

function isMediaObject(item) {
  return Boolean(
    item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.src === 'string' &&
      item.src,
  )
}

export function normalizeProductMedia(product) {
  const media = Array.isArray(product?.media) ? product.media.filter(isMediaObject) : []

  if (media.length > 0) {
    return media
  }

  if (product?.imageUrl) {
    return [
      {
        id: `product-${product.id ?? 'draft'}-legacy-image`,
        name: product?.name ? `${product.name} cover` : 'Product image',
        mimeType: 'image/*',
        src: product.imageUrl,
      },
    ]
  }

  return []
}

export function getPrimaryProductImage(product) {
  return normalizeProductMedia(product)[0]?.src ?? null
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error(`Unable to read "${file.name}".`))
    reader.readAsDataURL(file)
  })
}

export async function filesToProductMedia(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'))

  const media = await Promise.all(
    files.slice(0, MAX_PRODUCT_MEDIA).map(async (file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      mimeType: file.type,
      src: await readFileAsDataUrl(file),
    })),
  )

  return media
}

export function moveMediaItem(items, fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items
  }

  const nextItems = [...items]
  const [movedItem] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, movedItem)
  return nextItems
}

export function getRemainingMediaSlots(media) {
  return Math.max(0, MAX_PRODUCT_MEDIA - media.length)
}

export { MAX_PRODUCT_MEDIA }
