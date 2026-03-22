import prisma from '../db/prisma.js'

export async function listProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
  })
}

export async function createProduct(data) {
  return prisma.product.create({
    data,
  })
}

export async function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  })
}
