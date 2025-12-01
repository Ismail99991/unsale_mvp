import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123'

export default function FeaturedProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', color: '#4CAF50' })

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/content?type=featuredProducts')
      const data = await res.json()
      setProducts(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function addProduct() {
    if (!newProduct.name || !newProduct.price) return alert('Введите название и цену')
    await fetch('/api/content?type=featuredProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ item: newProduct })
    })
    setNewProduct({ name: '', price: '', color: '#4CAF50' })
    fetchProducts()
  }

  async function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return
    await fetch('/api/content?type=featuredProducts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    fetchProducts()
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/admin">← Назад</Link>
      <h1>Популярные товары</h1>

      <div>
        <h3>Добавить товар</h3>
        <input placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={styles.input} />
        <input placeholder="Цена" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={styles.input} />
        <input type="color" value={newProduct.color} onChange={e => setNewProduct({ ...newProduct, color: e.target.value })} style={{ ...styles.input, width: 60 }} />
        <button onClick={addProduct} style={styles.button}>Добавить</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Существующие товары</h3>
        {loading ? <p>Загрузка...</p> : products.map(p => (
          <div key={p.id} style={{ ...styles.card, backgroundColor: p.color }}>
            <div>{p.name} — {p.price}</div>
            <button style={styles.deleteButton} onClick={() => deleteProduct(p.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  input: { display: 'block', marginBottom: 10, padding: 8 },
  button: { padding: '8px 16px', backgroundColor: '#8cc552', color: 'white', border: 'none', cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', padding: 10, borderRadius: 8, marginBottom: 10, color: 'white' },
  deleteButton: { backgroundColor: 'red', border: 'none', color: 'white', padding: '4px 8px', cursor: 'pointer' }
}
