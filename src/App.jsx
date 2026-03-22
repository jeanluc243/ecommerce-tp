import { Route, Routes } from 'react-router-dom'
import { CheckoutPage } from '@/pages/checkout-page'
import { AdminPage } from '@/pages/admin-page'
import { BrandsPage } from '@/pages/brands-page'
import { CategoriesPage } from '@/pages/categories-page'
import { ProductDetailPage } from '@/pages/product-detail-page'
import { ProductsPage } from '@/pages/products-page'
import { StoreHomePage } from '@/pages/store-home-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StoreHomePage />} />
      <Route path="/store" element={<StoreHomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
