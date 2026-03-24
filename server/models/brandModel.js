import prisma from '../db/prisma.js'

export async function listBrands() {
  return prisma.brand.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function createBrand(data) {
  return prisma.brand.create({
    data,
  })
}

export async function getBrandById(id) {
  return prisma.brand.findUnique({
    where: { id },
  })
}

export async function updateBrand(id, data) {
  return prisma.brand.update({
    where: { id },
    data,
  })
}

export async function deleteBrand(id) {
  return prisma.brand.delete({
    where: { id },
  })
}
