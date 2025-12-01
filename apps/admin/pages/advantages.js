import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123'

export default function AdvantagesAdmin() {
  const [advantages, setAdvantages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAdv, setNewAdv] = useState({ icon: '🏭', text: '' })

  useEffect(() => { fetchAdvantages() }, [])

  async function fetchAdvantages() {
    setLoading(true)
    try {
      const res = await fetch('/api/content?type=advantages')
      const data = await res.json()
      setAdvantages(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function addAdv() {
    if (!newAdv.text) return alert('Введите текст')
    await fetch('/api/content?type=advantages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ item: newAdv })
    })
    setNewAdv({ icon: '🏭', text: '' })
    fetchAdvantages()
  }

  async function deleteAdv(id) {
    if (!confirm('Удалить элемент?')) return
    await fetch('/api/content?type=advantages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    fetchAdvantages()
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/admin">← Назад</Link>
      <h1>Преимущества</h1>

      <div>
        <h3>Добавить преимущество</h3>
        <input placeholder="Иконка" value={newAdv.icon} onChange={e => setNewAdv({ ...newAdv, icon: e.target.value })} style={styles.input} />
        <input placeholder="Текст" value={newAdv.text} onChange={e => setNewAdv({ ...newAdv, text: e.target.value })} style={styles.input} />
        <button onClick={addAdv} style={styles.button}>Добавить</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Существующие преимущества</h3>
        {loading ? <p>Загрузка...</p> : advantages.map(a => (
          <div key={a.id} style={styles.card}>
            <div>{a.icon} {a.text}</div>
            <button style={styles.deleteButton} onClick={() => deleteAdv(a.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  input: { display: 'block', marginBottom: 10, padding: 8 },
  button: { padding: '8px 16px', backgroundColor: '#8cc552', color: 'white', border: 'none', cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', padding: 10, borderRadius: 8, marginBottom: 10, backgroundColor: '#f0f0f0' },
  deleteButton: { backgroundColor: 'red', border: 'none', color: 'white', padding: '4px 8px', cursor: 'pointer' }
}
