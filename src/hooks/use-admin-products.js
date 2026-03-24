import { startTransition, useEffect, useState } from 'react'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '@/services/api'

export function useAdminProducts(enabled = true) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setProducts([])
      setError('')
      setIsLoading(false)
      return undefined
    }

    let active = true
    setIsLoading(true)

    async function loadProducts() {
      try {
        const data = await getAdminProducts()
        if (!active) return

        startTransition(() => {
          setProducts(data)
          setError('')
        })
      } catch (loadError) {
        if (!active) return
        setError(loadError.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [enabled])

  async function addProduct(payload) {
    setIsSaving(true)
    setError('')

    try {
      const product = await createAdminProduct(payload)
      startTransition(() => {
        setProducts((current) => [product, ...current])
      })
      return { ok: true }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function editProduct(productId, payload) {
    setIsSaving(true)
    setError('')

    try {
      const product = await updateAdminProduct(productId, payload)
      startTransition(() => {
        setProducts((current) =>
          current.map((item) => (item.id === productId ? product : item)),
        )
      })
      return { ok: true, product }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function removeProduct(productId) {
    setIsDeleting(true)
    setError('')

    try {
      await deleteAdminProduct(productId)
      startTransition(() => {
        setProducts((current) => current.filter((item) => item.id !== productId))
      })
      return { ok: true }
    } catch (deleteError) {
      setError(deleteError.message)
      return { ok: false, message: deleteError.message }
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    products,
    isLoading,
    isSaving,
    isDeleting,
    error,
    addProduct,
    editProduct,
    removeProduct,
  }
}
