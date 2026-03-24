import { getAdminToken } from '@/lib/admin-auth'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

function getAdminHeaders() {
  const token = getAdminToken()

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

async function parseApiError(response, fallbackMessage) {
  const data = await response.json().catch(() => null)
  throw new Error(data?.message ?? fallbackMessage)
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) await parseApiError(res, 'Erreur chargement produits')
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`)
  if (!res.ok) await parseApiError(res, 'Erreur chargement categories')
  return res.json()
}

export async function getBrands() {
  const res = await fetch(`${API_URL}/brands`)
  if (!res.ok) await parseApiError(res, 'Erreur chargement marques')
  return res.json()
}

export async function getProduct(productId) {
  const res = await fetch(`${API_URL}/products/${productId}`)
  if (!res.ok) await parseApiError(res, 'Erreur chargement produit')
  return res.json()
}

export async function createOrder(payload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur creation commande')
  }

  return data
}

export async function getAdminProducts() {
  const res = await fetch(`${API_URL}/admin/products`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) await parseApiError(res, 'Erreur chargement produits admin')
  return res.json()
}

export async function getAdminOrders() {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) await parseApiError(res, 'Erreur chargement commandes')
  return res.json()
}

export async function validateAdminOrderOnWhatsApp(orderId) {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/validate-whatsapp`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur validation commande')
  }

  return data
}

export async function getAdminCategories() {
  const res = await fetch(`${API_URL}/admin/categories`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) await parseApiError(res, 'Erreur chargement categories admin')
  return res.json()
}

export async function createAdminCategory(payload) {
  const res = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur creation categorie')
  }

  return data
}

export async function updateAdminCategory(categoryId, payload) {
  const res = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur modification categorie')
  }

  return data
}

export async function deleteAdminCategory(categoryId) {
  const res = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Erreur suppression categorie')
  }
}

export async function getAdminBrands() {
  const res = await fetch(`${API_URL}/admin/brands`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) await parseApiError(res, 'Erreur chargement marques admin')
  return res.json()
}

export async function createAdminBrand(payload) {
  const res = await fetch(`${API_URL}/admin/brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur creation marque')
  }

  return data
}

export async function updateAdminBrand(brandId, payload) {
  const res = await fetch(`${API_URL}/admin/brands/${brandId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur modification marque')
  }

  return data
}

export async function deleteAdminBrand(brandId) {
  const res = await fetch(`${API_URL}/admin/brands/${brandId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Erreur suppression marque')
  }
}

export async function createAdminProduct(payload) {
  const res = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur creation produit')
  }

  return data
}

export async function updateAdminProduct(productId, payload) {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur modification produit')
  }

  return data
}

export async function deleteAdminProduct(productId) {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Erreur suppression produit')
  }
}

export async function loginAdmin(payload) {
  const res = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Erreur connexion admin')
  }

  return data
}
