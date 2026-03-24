import { startTransition, useEffect, useState } from 'react'
import { getAdminOrders, validateAdminOrderOnWhatsApp } from '@/services/api'

export function useAdminOrders(enabled = true) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setOrders([])
      setError('')
      setIsLoading(false)
      return undefined
    }

    let active = true
    setIsLoading(true)

    async function loadOrders() {
      try {
        const data = await getAdminOrders()
        if (!active) return

        startTransition(() => {
          setOrders(data)
          setError('')
        })
      } catch (loadError) {
        if (!active) return
        setError(loadError.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [enabled])

  async function validateOnWhatsApp(orderId) {
    setIsValidating(true)
    setError('')

    try {
      const updatedOrder = await validateAdminOrderOnWhatsApp(orderId)
      startTransition(() => {
        setOrders((current) =>
          current.map((item) => (item.id === orderId ? updatedOrder : item)),
        )
      })
      return { ok: true, order: updatedOrder }
    } catch (validationError) {
      setError(validationError.message)
      return { ok: false, message: validationError.message }
    } finally {
      setIsValidating(false)
    }
  }

  return {
    orders,
    isLoading,
    isValidating,
    error,
    validateOnWhatsApp,
  }
}
