import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminHome() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // какой тип редактируем сейчас
  const [activeType, setActiveType] = useState(null) // null = показывать меню
  const [form, setForm] = useState({})

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/content')
      if (!res.ok) throw new Error('Не удалось загрузить контент')
      const json = await res.json()
      setContent(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function listForType(type) {
    return content?.[type] ?? []
  }

  function startEdit(item = null) {
    setForm(item ? { ...item } : {})
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function save() {
    const isNew = typeof form.id === 'undefined' || form.id === ''
    try {
      const body = isNew
        ? JSON.stringify({ type: activeType, item: removeEmpty(form) })
        : JSON.stringify({ type: activeType, id: form.id, item: removeEmpty(form) })

      const res = await fetch('/api/content', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Save failed' }))
        throw new Error(err?.error || 'Сохранение не удалось')
      }
      await load()
      setForm({})
    } catch (err) {
      alert(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Удалить элемент?')) return
    try {
      const res = await fetch('/api/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeType, id })
      })
      if (!res.ok) throw new Error('Удаление не удалось')
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  // небольшая утиль: убирает пустые поля из объекта перед отправкой
  function removeEmpty(obj) {
    const out = {}
    for (const k in obj) {
      if (obj[k] !== '' && typeof obj[k] !== 'undefined' && obj[k] !== null) out[k] = obj[k]
    }
    return out
  }

  if (loading) return <div style={{ padding: 20 }}>Загрузка...</div>
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>

  // Если activeType === null => показываем меню
  if (!activeType) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Unsale Admin</h1>
            <p style={styles.subtitle}>Панель управления B2B платформой</p>
          </div>
        </header>

        <div style={styles.menuGrid}>
          <div style={styles.menuCard} onClick={() => setActiveType('banners')}>
            <div style={styles.menuIcon}>🖼️</div>
            <h3 style={styles.menuTitle}>Баннеры</h3>
            <p style={styles.menuDesc}>Управление промо-баннерами на главной</p>
          </div>

          <div style={styles.menuCard} onClick={() => setActiveType('categories')}>
            <div style={styles.menuIcon}>📚</div>
            <h3 style={styles.menuTitle}>Категории</h3>
            <p style={styles.menuDesc}>Краткие быстрые категории</p>
          </div>

          <div style={styles.menuCard} onClick={() => setActiveType('featuredProducts')}>
            <div style={styles.menuIcon}>🧵</div>
            <h3 style={styles.menuTitle}>Популярные товары</h3>
            <p style={styles.menuDesc}>Товары, отображаемые в разделе «Популярные ткани»</p>
          </div>

          <div style={styles.menuCard} onClick={() => setActiveType('advantages')}>
            <div style={styles.menuIcon}>✅</div>
            <h3 style={styles.menuTitle}>Преимущества</h3>
            <p style={styles.menuDesc}>Компактные преимущества (иконка + текст)</p>
          </div>

          <Link href="/samples-catalog" legacyBehavior>
            <a style={{ ...styles.menuCard, textDecoration: 'none', color: 'inherit' }}>
              <div style={styles.menuIcon}>📦</div>
              <h3 style={styles.menuTitle}>Каталог образцов</h3>
              <p style={styles.menuDesc}>Управление товарами для бесплатных образцов</p>
            </a>
          </Link>

          <div style={styles.menuCardDisabled}>
            <div style={styles.menuIcon}>👥</div>
            <h3 style={styles.menuTitle}>Клиенты (скоро)</h3>
            <p style={styles.menuDesc}>Управление клиентами и заявками</p>
          </div>
        </div>
      </div>
    )
  }

  // Режим редактирования списка выбранного типа
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ margin: 0, color: '#115c5c' }}>{activeType}</h2>
        <div>
          <button onClick={() => { setActiveType(null); setForm({}) }} style={styles.smallBtn}>← Меню</button>
          <button onClick={() => startEdit(null)} style={{ ...styles.smallBtn, marginLeft: 8 }}>Добавить</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h4>Список</h4>
          <ul style={{ paddingLeft: 18 }}>
            {listForType(activeType).map(item => (
              <li key={item.id} style={{ marginBottom: 12 }}>
                <strong>{item.title ?? item.name ?? item.text ?? `#${item.id}`}</strong>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => startEdit(item)} style={styles.smallBtn}>Редактировать</button>
                  <button onClick={() => remove(item.id)} style={{ ...styles.smallBtn, marginLeft: 8, color: 'white', background: '#d9534f' }}>Удалить</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: 420 }}>
          <h4>Редактор</h4>

          <div style={{ display: 'grid', gap: 8 }}>
            {/* Рендерим поля, которые обычно встречаются в элементах: title, name, text, subtitle, price, icon, color */}
            {(['title', 'name', 'text', 'subtitle', 'price', 'icon', 'color']).map(f => (
              <div key={f}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>{f}</label>
                <input
                  name={f}
                  value={form[f] ?? ''}
                  onChange={handleChange}
                  placeholder={f}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={{ padding: '8px 12px', background: '#115c5c', color: '#fff', border: 'none', borderRadius: 6 }}>Сохранить</button>
              <button onClick={() => setForm({})} style={styles.smallBtn}>Очистить</button>
            </div>

            <div>
              <small>Примечание: сейчас данные сохраняются на сервере в памяти (demo). Для постоянного хранения замените реализацию API на файл/БД.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------- Стили ---------------------- */
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    color: '#115c5c',
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 12px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '18px',
    margin: 0
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  menuCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.12s',
    cursor: 'pointer'
  },
  menuCardDisabled: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    border: '1px dashed #ddd',
    textDecoration: 'none',
    color: '#999'
  },
  menuIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  menuTitle: {
    color: '#115c5c',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0'
  },
  menuDesc: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5'
  },
  smallBtn: {
    padding: '8px 12px',
    background: '#eee',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  }
}
