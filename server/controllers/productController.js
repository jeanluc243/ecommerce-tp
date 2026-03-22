import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../models/productModel.js'
import { presentProduct, presentProducts } from '../presenters/productPresenter.js'

function sanitizeProductInput(payload) {
  return {
    name: payload.name?.trim(),
    description: payload.description?.trim() || null,
    category: payload.category?.trim() || null,
    brand: payload.brand?.trim() || null,
    imageUrl: payload.imageUrl?.trim() || null,
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
