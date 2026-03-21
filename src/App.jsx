import { useEffect, useState } from 'react'
import { getProducts } from './services/api'

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error)
  }, [])

  return (
    <div>
      <h1>Mon e-commerce</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong>{product.price} $</strong>
        </div>
      ))}
    </div>
  )
}

export default App