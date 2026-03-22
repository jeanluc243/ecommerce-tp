/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'ecommerce-tp-cart'

function normalizeQuantity(quantity) {
  return Math.max(1, Number(quantity) || 1)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []

    try {
      const value = window.localStorage.getItem(STORAGE_KEY)
      return value ? JSON.parse(value) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    const nextQuantity = normalizeQuantity(quantity)

    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + nextQuantity }
            : item,
        )
      }

      return [...current, { product, quantity: nextQuantity }]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    const nextQuantity = Number(quantity)

    if (nextQuantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
