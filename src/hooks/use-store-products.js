import { useEffect, useState } from 'react'
import { getProducts } from '@/services/api'

export function useStoreProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getProducts()
        if (!active) return
        setProducts(data)
        setError('')
      } catch (loadError) {
        if (!active) return
        setError(loadError.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  return {
    products,
    isLoading,
    error,
  }
}
