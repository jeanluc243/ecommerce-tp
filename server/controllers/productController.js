import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../models/productModel.js'
import { presentProduct, presentProducts } from '../presenters/productPresenter.js'

const MAX_PRODUCT_MEDIA = 8
const MAX_MEDIA_DATA_URL_LENGTH = 7_000_000

function isSupportedProductMediaSrc(src) {
  return (
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(src) ||
    /^https?:\/\//.test(src) ||
    src.startsWith('/')
  )
}

function sanitizeProductMedia(media) {
  if (!Array.isArray(media)) {
    return []
  }

  return media
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const id = item.id?.trim()
      const name = item.name?.trim()
      const mimeType = item.mimeType?.trim()
      const src = item.src?.trim()

      if (!id || !src) {
        return null
      }

      return {
        id,
        name: name || `image-${index + 1}`,
        mimeType: mimeType || 'image/*',
        src,
      }
    })
    .filter(Boolean)
}

function sanitizeProductInput(payload) {
  return {
    name: payload.name?.trim(),
    description: payload.description?.trim() || null,
    category: payload.category?.trim() || null,
    brand: payload.brand?.trim() || null,
    imageUrl: null,
    media: sanitizeProductMedia(payload.media),
    price: Number(payload.price),
    stock: Number(payload.stock ?? 0),
  }
}

function validateProductInput(data) {
  if (!data.name) {
    return 'Product name is required.'
  }

  if (Number.isNaN(data.price) || data.price < 0) {
    return 'Price must be a valid positive number.'
  }

  if (!Number.isInteger(data.stock) || data.stock < 0) {
    return 'Stock must be a valid positive integer.'
  }

  if (data.media.length > MAX_PRODUCT_MEDIA) {
    return `You can upload up to ${MAX_PRODUCT_MEDIA} images per product.`
  }

  const hasInvalidMedia = data.media.some(
    (item) =>
      !isSupportedProductMediaSrc(item.src) ||
      item.src.length > MAX_MEDIA_DATA_URL_LENGTH,
  )

  if (hasInvalidMedia) {
    return 'Images must be valid image files under the allowed size limit.'
  }

  return null
}

function getProductId(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}

export async function getProducts(req, res, next) {
  try {
    const products = await listProducts()
    res.json(presentProducts(products))
  } catch (error) {
    next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const id = getProductId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Invalid product id.' })
    }

    const product = await getProductById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    return res.json(presentProduct(product))
  } catch (error) {
    return next(error)
  }
}

export async function createAdminProduct(req, res, next) {
  try {
    const data = sanitizeProductInput(req.body)
    const validationError = validateProductInput(data)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const product = await createProduct(data)
    return res.status(201).json(presentProduct(product))
  } catch (error) {
    return next(error)
  }
}

export async function updateAdminProduct(req, res, next) {
  try {
    const id = getProductId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Invalid product id.' })
    }

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    const data = sanitizeProductInput(req.body)
    const validationError = validateProductInput(data)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const product = await updateProduct(id, data)
    return res.json(presentProduct(product))
  } catch (error) {
    return next(error)
  }
}

export async function deleteAdminProduct(req, res, next) {
  try {
    const id = getProductId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Invalid product id.' })
    }

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    await deleteProduct(id)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
