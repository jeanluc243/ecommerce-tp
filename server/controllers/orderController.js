import prisma from '../db/prisma.js'
import { createOrder, getOrderById, listOrders, updateOrder } from '../models/orderModel.js'
import { presentOrder } from '../presenters/orderPresenter.js'

function sanitizeCheckout(payload) {
  return {
    customerPhone: payload.customerPhone?.trim() ?? '',
    customerCode: payload.customerCode?.trim() ?? '',
    items: Array.isArray(payload.items) ? payload.items : [],
  }
}

function validateCheckoutInput(data) {
  if (!/^\d{6,15}$/.test(data.customerPhone)) {
    return 'Le numero de telephone doit contenir entre 6 et 15 chiffres.'
  }

  if (!/^\d{4}$/.test(data.customerCode)) {
    return 'Le code doit contenir exactement 4 chiffres.'
  }

  if (data.items.length === 0) {
    return 'Le panier est vide.'
  }

  if (data.items.some((item) => !Number.isInteger(Number(item.productId)) || Number(item.quantity) <= 0)) {
    return 'Le panier contient des articles invalides.'
  }

  return null
}

export async function createCheckoutOrder(req, res, next) {
  try {
    const data = sanitizeCheckout(req.body)
    const validationError = validateCheckoutInput(data)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const productIds = data.items.map((item) => Number(item.productId))
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Certains produits n\'existent plus.' })
    }

    const productMap = new Map(products.map((product) => [product.id, product]))
    const orderItems = []
    let totalAmount = 0

    for (const item of data.items) {
      const productId = Number(item.productId)
      const quantity = Number(item.quantity)
      const product = productMap.get(productId)

      if (!product) {
        return res.status(400).json({ message: 'Produit invalide dans le panier.' })
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}.` })
      }

      totalAmount += product.price * quantity
      orderItems.push({
        productId,
        quantity,
        unitPrice: product.price,
      })
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return createOrder(tx, {
        customerPhone: data.customerPhone,
        customerCode: data.customerCode,
        totalAmount,
        items: {
          create: orderItems,
        },
      })
    })

    return res.status(201).json(presentOrder(order))
  } catch (error) {
    return next(error)
  }
}

export async function getAdminOrders(req, res, next) {
  try {
    const orders = await listOrders(prisma)
    return res.json(orders.map(presentOrder))
  } catch (error) {
    return next(error)
  }
}

export async function validateAdminOrderOnWhatsApp(req, res, next) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Identifiant de commande invalide.' })
    }

    const existingOrder = await getOrderById(prisma, id)

    if (!existingOrder) {
      return res.status(404).json({ message: 'Commande introuvable.' })
    }

    const updatedOrder = await updateOrder(prisma, id, {
      status: 'VALIDATED_WHATSAPP',
      validatedAt: new Date(),
    })

    return res.json(presentOrder(updatedOrder))
  } catch (error) {
    return next(error)
  }
}
