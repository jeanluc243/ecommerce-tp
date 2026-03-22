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

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}

export async function getProduct(productId) {
  const res = await fetch(`${API_URL}/products/${productId}`)
  if (!res.ok) throw new Error('Erreur chargement produit')
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
  if (!res.ok) throw new Error('Erreur chargement produits admin')
  return res.json()
}

export async function getAdminOrders() {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) throw new Error('Erreur chargement commandes')
  return res.json()
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
