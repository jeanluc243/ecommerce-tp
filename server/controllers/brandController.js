import prisma from '../db/prisma.js'
import {
  createBrand,
  deleteBrand,
  getBrandById,
  listBrands,
} from '../models/brandModel.js'

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

export async function getBrands(req, res, next) {
  try {
    const [brands, products] = await Promise.all([
      listBrands(),
      prisma.product.findMany({
        select: {
          id: true,
          brand: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const productByBrand = products.reduce((map, product) => {
      const key = product.brand?.trim()
      if (!key) {
        return map
      }

      const current = map.get(key) ?? { count: 0, sampleProductId: product.id }
      current.count += 1
      map.set(key, current)
      return map
    }, new Map())

    return res.json(
      brands.map((brand) => ({
        ...brand,
        productCount: productByBrand.get(brand.name)?.count ?? 0,
        sampleProductId: productByBrand.get(brand.name)?.sampleProductId ?? null,
      })),
    )
  } catch (error) {
    return next(error)
  }
}

export async function createAdminBrand(req, res, next) {
  try {
    const data = sanitizeName(req.body)

    if (!data.name) {
      return res.status(400).json({ message: 'Le nom de la marque est requis.' })
    }

    const brand = await createBrand(data)
    return res.status(201).json({
      ...brand,
      productCount: 0,
      sampleProductId: null,
    })
  } catch (error) {
    return next(error)
  }
}

export async function updateAdminBrand(req, res, next) {
  try {
    const id = getEntityId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Identifiant de marque invalide.' })
    }

    const existingBrand = await getBrandById(id)

    if (!existingBrand) {
      return res.status(404).json({ message: 'Marque introuvable.' })
    }

    const data = sanitizeName(req.body)

    if (!data.name) {
      return res.status(400).json({ message: 'Le nom de la marque est requis.' })
    }

    const brand = await prisma.$transaction(async (tx) => {
      const updatedBrand = await tx.brand.update({
        where: { id },
        data,
      })

      if (existingBrand.name !== updatedBrand.name) {
        await tx.product.updateMany({
          where: { brand: existingBrand.name },
          data: { brand: updatedBrand.name },
        })
      }

      return updatedBrand
    })

    const productCount = await prisma.product.count({
      where: { brand: brand.name },
    })

    const sampleProduct = await prisma.product.findFirst({
      where: { brand: brand.name },
      select: { id: true },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      ...brand,
      productCount,
      sampleProductId: sampleProduct?.id ?? null,
    })
  } catch (error) {
    return next(error)
  }
}

export async function deleteAdminBrand(req, res, next) {
  try {
    const id = getEntityId(req.params.id)

    if (!id) {
      return res.status(400).json({ message: 'Identifiant de marque invalide.' })
    }

    const existingBrand = await getBrandById(id)

    if (!existingBrand) {
      return res.status(404).json({ message: 'Marque introuvable.' })
    }

    const linkedProducts = await prisma.product.count({
      where: { brand: existingBrand.name },
    })

    if (linkedProducts > 0) {
      return res.status(400).json({
        message: 'Cette marque est encore utilisee par des produits. Modifiez d\'abord ces produits.',
      })
    }

    await deleteBrand(id)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
