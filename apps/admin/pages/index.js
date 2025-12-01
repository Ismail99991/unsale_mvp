import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123'

export default function AdminHome() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', color: '#115c5c' })

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    setLoading(true)
    try {
      const res = await fetch('/api/content?type=banners')
      const data = await res.json()
      setBanners(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addBanner() {
    if (!newBanner.title) return alert('Введите заголовок')
    await fetch('/api/content?type=banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({ item: newBanner })
    })
    setNewBanner({ title: '', subtitle: '', color: '#115c5c' })
    fetchBanners()
  }

  async function deleteBanner(id) {
    if (!confirm('Удалить баннер?')) return
    await fetch('/api/content?type=banners', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({ id })
    })
    fetchBanners()
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Unsale Admin</h1>
        <p style={styles.subtitle}>Панель управления контентом</p>
      </header>

      <nav style={styles.nav}>
        <Link href="/admin" style={styles.navLink}>Баннеры</Link>
        <Link href="/admin/categories" style={styles.navLink}>Категории</Link>
        <Link href="/admin/featured-products" style={styles.navLink}>Популярные товары</Link>
        <Link href="/admin/advantages" style={styles.navLink}>Преимущества</Link>
      </nav>

      <section style={styles.section}>
        <h2>Добавить баннер</h2>
        <input
          style={styles.input}
          placeholder="Заголовок"
          value={newBanner.title}
          onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Подзаголовок"
          value={newBanner.subtitle}
          onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
        />
        <input
          style={styles.input}
          type="color"
          value={newBanner.color}
          onChange={e => setNewBanner({ ...newBanner, color: e.target.value })}
        />
        <button style={styles.button} onClick={addBanner}>Добавить</button>
      </section>

      <section style={styles.section}>
        <h2>Существующие баннеры</h2>
        {loading ? <p>Загрузка...</p> :
          banners.map(b => (
            <div key={b.id} style={{ ...styles.card, backgroundColor: b.color }}>
              <div>
                <strong>{b.title}</strong> — {b.subtitle}
              </div>
              <button style={styles.deleteButton} onClick={() => deleteBanner(b.id)}>Удалить</button>
            </div>
          ))
        }
      </section>
    </div>
  )
}

const styles = {
  container: { padding: 20, fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 32, color: '#115c5c', margin: 0 },
  subtitle: { color: '#666', margin: 0 },
  nav: { display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20 },
  navLink: { textDecoration: 'none', color: '#115c5c', fontWeight: 600 },
  section: { marginBottom: 30 },
  input: { display: 'block', marginBottom: 10, padding: 8, width: 300 },
  button: { padding: '8px 16px', backgroundColor: '#8cc552', color: 'white', border: 'none', cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', padding: 10, borderRadius: 8, marginBottom: 10, color: 'white' },
  deleteButton: { backgroundColor: 'red', border: 'none', color: 'white', padding: '4px 8px', cursor: 'pointer' }
}
