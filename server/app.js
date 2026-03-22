import cors from 'cors'
import express from 'express'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'API OK' })
})

app.use('/api', adminAuthRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

export default app
