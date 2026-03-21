const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Erreur chargement produits')
  return res.json()
}
