import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123'

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState({ name: '', icon: '🧵', color: '#e3f2fd' })

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await fetch('/api/content?type=categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function addCategory() {
    if (!newCat.name) return alert('Введите название')
    await fetch('/api/content?type=categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ item: newCat })
    })
    setNewCat({ name: '', icon: '🧵', color: '#e3f2fd' })
    fetchCategories()
  }

  async function deleteCategory(id) {
    if (!confirm('Удалить категорию?')) return
    await fetch('/api/content?type=categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    fetchCategories()
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/admin">← Назад</Link>
      <h1>Категории</h1>

      <div>
        <h3>Добавить категорию</h3>
        <input placeholder="Название" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} style={styles.input} />
        <input placeholder="Иконка" value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} style={styles.input} />
        <input type="color" value={newCat.color} onChange={e => setNewCat({ ...newCat, color: e.target.value })} style={{ ...styles.input, width: 60 }} />
        <button onClick={addCategory} style={styles.button}>Добавить</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Существующие категории</h3>
        {loading ? <p>Загрузка...</p> : categories.map(c => (
          <div key={c.id} style={{ ...styles.card, backgroundColor: c.color }}>
            <div>{c.icon} {c.name}</div>
            <button style={styles.deleteButton} onClick={() => deleteCategory(c.id)}>Удалить</button>
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
