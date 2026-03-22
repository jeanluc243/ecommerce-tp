function formatCurrencyValue(value) {
  return Number(value ?? 0)
}

export function presentProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? 'Description of this product.',
    price: formatCurrencyValue(product.price),
    imageUrl: product.imageUrl,
    category: product.category ?? 'Electronics',
    brand: product.brand ?? 'Store',
    stock: product.stock,
    inStock: product.stock > 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export function presentProducts(products) {
  return products.map(presentProduct)
}
