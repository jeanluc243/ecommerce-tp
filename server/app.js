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
      message: 'Base de donnees indisponible. Verifiez DATABASE_URL et l\'acces reseau.',
    })
  }

  if (errorCode === 'P2021') {
    return res.status(500).json({
      message: 'Le schema de la base de donnees n\'est pas synchronise. Executez les migrations Prisma.',
    })
  }

  if (errorCode === 'P2022') {
    return res.status(500).json({
      message: 'Les colonnes de la base de donnees ne correspondent pas au schema Prisma. Executez les migrations Prisma.',
    })
  }

  if (errorCode === 'P2002') {
    return res.status(409).json({
      message: 'Un enregistrement avec la meme valeur unique existe deja.',
    })
  }

  res.status(500).json({ message: 'Erreur interne du serveur' })
})

export default app
