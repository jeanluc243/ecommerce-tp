function formatCurrencyValue(value) {
  return Number(value ?? 0)
}

function normalizeProductMedia(product) {
  const media = Array.isArray(product.media)
    ? product.media
        .map((item, index) => {
          if (!item || typeof item !== 'object') {
            return null
          }

          const src = typeof item.src === 'string' ? item.src : ''
          if (!src) {
            return null
          }

          return {
            id:
              typeof item.id === 'string' && item.id
                ? item.id
                : `product-${product.id}-media-${index}`,
            name:
              typeof item.name === 'string' && item.name
                ? item.name
                : `${product.name} ${index + 1}`,
            mimeType:
              typeof item.mimeType === 'string' && item.mimeType
                ? item.mimeType
                : 'image/*',
            src,
          }
        })
        .filter(Boolean)
    : []

  if (media.length > 0) {
    return media
  }

  if (product.imageUrl) {
    return [
      {
        id: `product-${product.id}-legacy-image`,
        name: `${product.name} couverture`,
        mimeType: 'image/*',
        src: product.imageUrl,
      },
    ]
  }

  return []
}

export function presentProduct(product) {
  const media = normalizeProductMedia(product)

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? 'Description de ce produit.',
    price: formatCurrencyValue(product.price),
    imageUrl: media[0]?.src ?? product.imageUrl,
    media,
    category: product.category ?? 'Electronique',
    brand: product.brand ?? 'Jo Store',
    stock: product.stock,
    inStock: product.stock > 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export function presentProducts(products) {
  return products.map(presentProduct)
}
