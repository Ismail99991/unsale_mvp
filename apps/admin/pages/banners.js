import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123'

export default function BannersAdmin() {
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
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ item: newBanner })
    })
    setNewBanner({ title: '', subtitle: '', color: '#115c5c' })
    fetchBanners()
  }

  async function deleteBanner(id) {
    if (!confirm('Удалить баннер?')) return
    await fetch('/api/content?type=banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    fetchBanners()
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/admin" style={{ marginBottom: 20, display: 'inline-block' }}>← Назад</Link>
      <h1>Баннеры</h1>

      <div style={{ marginTop: 20 }}>
        <h3>Добавить баннер</h3>
        <input placeholder="Заголовок" value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} style={styles.input} />
        <input placeholder="Подзаголовок" value={newBanner.subtitle} onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} style={styles.input} />
        <input type="color" value={newBanner.color} onChange={e => setNewBanner({ ...newBanner, color: e.target.value })} style={{ ...styles.input, width: 60 }} />
        <button onClick={addBanner} style={styles.button}>Добавить</button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Существующие баннеры</h3>
        {loading ? <p>Загрузка...</p> : banners.map(b => (
          <div key={b.id} style={{ ...styles.card, backgroundColor: b.color }}>
            <div>
              <strong>{b.title}</strong> — {b.subtitle}
            </div>
            <button style={styles.deleteButton} onClick={() => deleteBanner(b.id)}>Удалить</button>
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
