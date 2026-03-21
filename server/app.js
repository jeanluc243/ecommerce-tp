import cors from 'cors'
import express from 'express'
import prisma from './db/prisma.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'API OK' })
})

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  res.json(products)
})

app.post('/api/products', async (req, res) => {
  const { name, description, price, imageUrl, stock } = req.body

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      imageUrl,
      stock: Number(stock ?? 0)
    }
  })

  res.status(201).json(product)
})

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

export default app
