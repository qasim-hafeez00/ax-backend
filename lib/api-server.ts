import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getProducts(page = 1, limit = 10) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })
  return products
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })
  return product
}

// Add other server-side API functions as needed

