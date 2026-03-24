import prisma from '../db/prisma.js'

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function createCategory(data) {
  return prisma.category.create({
    data,
  })
}

export async function getCategoryById(id) {
  return prisma.category.findUnique({
    where: { id },
  })
}

export async function updateCategory(id, data) {
  return prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id) {
  return prisma.category.delete({
    where: { id },
  })
}
