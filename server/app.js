import cors from 'cors'
import express from 'express'
import { Prisma } from '@prisma/client'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '20mb' }))

app.get('/api/health', (req, res) => {
  res.json({ message: 'API OK' })
})

app.use('/api', adminAuthRoutes)
app.use('/api', categoryRoutes)
app.use('/api', brandRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

function getPrismaErrorCode(error) {
  return error?.code ?? error?.errorCode ?? null
}

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)

  const errorCode = getPrismaErrorCode(error)

  if (
    errorCode === 'P1001' ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    return res.status(503).json({
      message: 'Database unavailable. Check DATABASE_URL and network access.',
    })
  }

  if (errorCode === 'P2021') {
    return res.status(500).json({
      message: 'Database schema is out of sync. Run Prisma migrations.',
    })
  }

  if (errorCode === 'P2022') {
    return res.status(500).json({
      message: 'Database columns are out of sync with Prisma schema. Run Prisma migrations.',
    })
  }

  if (errorCode === 'P2002') {
    return res.status(409).json({
      message: 'A record with the same unique value already exists.',
    })
  }

  res.status(500).json({ message: 'Internal server error' })
})

export default app
