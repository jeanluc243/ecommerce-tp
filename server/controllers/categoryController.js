import prisma from '../db/prisma.js'
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
} from '../models/categoryModel.js'

function sanitizeName(payload) {
  return {
    name: payload.name?.trim() ?? '',
  }
}

function getEntityId(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}

export async function getCategories(req, res, next) {
  try {
    const [categories, products] = await Promise.all([
      listCategories(),
      prisma.product.findMany({
        select: {
          id: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const productByCategory = products.reduce((map, product) => {
      const key = product.category?.trim()
      if (!key) {
        return map
      }

      const current = map.get(key) ?? { count: 0, sampleProductId: product.id }
      current.count += 1
      map.set(key, current)
      return map
    }, new Map())

    return res.json(
      categories.map((category) => ({
        ...category,
        productCount: productByCategory.get(category.name)?.count ?? 0,
        sampleProductId: productByCategory.get(category.name)?.sampleProductId ?? null,
      })),
    )
  } catch (error) {
    return next(error)
  }
}

export async function createAdminCategory(req, res, next) {
  try {
    const data = sanitizeName(req.body)

    if (!data.name) {
      return res.status(400).json({ message: 'Le nom de la categorie est requis.' })
    }

    const category = await createCategory(data)
    return res.status(201).json({
      ...category,
      productCount: 0,
      sampleProductId: null,
    })
  } catch (error) {
    return next(error)
  }
}

export async function updateAdminCategory(req, res, next) {
  try {
    const id = getEntityId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Identifiant de categorie invalide.' })
    }

    const existingCategory = await getCategoryById(id)

    if (!existingCategory) {
      return res.status(404).json({ message: 'Categorie introuvable.' })
    }

    const data = sanitizeName(req.body)

    if (!data.name) {
      return res.status(400).json({ message: 'Le nom de la categorie est requis.' })
    }

    const category = await prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({
        where: { id },
        data,
      })

      if (existingCategory.name !== updatedCategory.name) {
        await tx.product.updateMany({
          where: { category: existingCategory.name },
          data: { category: updatedCategory.name },
        })
      }

      return updatedCategory
    })

    const productCount = await prisma.product.count({
      where: { category: category.name },
    })

    const sampleProduct = await prisma.product.findFirst({
      where: { category: category.name },
      select: { id: true },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      ...category,
      productCount,
      sampleProductId: sampleProduct?.id ?? null,
    })
  } catch (error) {
    return next(error)
  }
}

export async function deleteAdminCategory(req, res, next) {
  try {
    const id = getEntityId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Identifiant de categorie invalide.' })
    }

    const existingCategory = await getCategoryById(id)

    if (!existingCategory) {
      return res.status(404).json({ message: 'Categorie introuvable.' })
    }

    const linkedProducts = await prisma.product.count({
      where: { category: existingCategory.name },
    })

    if (linkedProducts > 0) {
      return res.status(400).json({
        message: 'Cette categorie est encore utilisee par des produits. Modifiez d\'abord ces produits.',
      })
    }

    await deleteCategory(id)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
