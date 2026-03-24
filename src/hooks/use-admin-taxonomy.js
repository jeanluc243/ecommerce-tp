import { startTransition, useEffect, useState } from 'react'
import {
  createAdminBrand,
  createAdminCategory,
  deleteAdminBrand,
  deleteAdminCategory,
  getAdminBrands,
  getAdminCategories,
  updateAdminBrand,
  updateAdminCategory,
} from '@/services/api'

export function useAdminTaxonomy(enabled = true) {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setCategories([])
      setBrands([])
      setError('')
      setIsLoading(false)
      return undefined
    }

    let active = true
    setIsLoading(true)

    async function load() {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAdminCategories(),
          getAdminBrands(),
        ])

        if (!active) return

        startTransition(() => {
          setCategories(categoriesData)
          setBrands(brandsData)
          setError('')
        })
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
  }, [enabled])

  async function addCategory(payload) {
    setIsSaving(true)
    setError('')

    try {
      const category = await createAdminCategory(payload)
      startTransition(() => {
        setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)))
      })
      return { ok: true, category }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function editCategory(categoryId, payload) {
    setIsSaving(true)
    setError('')

    try {
      const category = await updateAdminCategory(categoryId, payload)
      startTransition(() => {
        setCategories((current) =>
          current
            .map((item) => (item.id === categoryId ? category : item))
            .sort((a, b) => a.name.localeCompare(b.name)),
        )
      })
      return { ok: true, category }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function removeCategory(categoryId) {
    setIsDeleting(true)
    setError('')

    try {
      await deleteAdminCategory(categoryId)
      startTransition(() => {
        setCategories((current) => current.filter((item) => item.id !== categoryId))
      })
      return { ok: true }
    } catch (deleteError) {
      setError(deleteError.message)
      return { ok: false, message: deleteError.message }
    } finally {
      setIsDeleting(false)
    }
  }

  async function addBrand(payload) {
    setIsSaving(true)
    setError('')

    try {
      const brand = await createAdminBrand(payload)
      startTransition(() => {
        setBrands((current) => [...current, brand].sort((a, b) => a.name.localeCompare(b.name)))
      })
      return { ok: true, brand }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function editBrand(brandId, payload) {
    setIsSaving(true)
    setError('')

    try {
      const brand = await updateAdminBrand(brandId, payload)
      startTransition(() => {
        setBrands((current) =>
          current
            .map((item) => (item.id === brandId ? brand : item))
            .sort((a, b) => a.name.localeCompare(b.name)),
        )
      })
      return { ok: true, brand }
    } catch (saveError) {
      setError(saveError.message)
      return { ok: false, message: saveError.message }
    } finally {
      setIsSaving(false)
    }
  }

  async function removeBrand(brandId) {
    setIsDeleting(true)
    setError('')

    try {
      await deleteAdminBrand(brandId)
      startTransition(() => {
        setBrands((current) => current.filter((item) => item.id !== brandId))
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
    categories,
    brands,
    isLoading,
    isSaving,
    isDeleting,
    error,
    addCategory,
    editCategory,
    removeCategory,
    addBrand,
    editBrand,
    removeBrand,
  }
}
