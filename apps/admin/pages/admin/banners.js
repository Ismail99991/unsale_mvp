// apps/admin/pages/banners.js
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '../../lib/supabase'

export default function BannersAdmin() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', color: '', image: null })

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    setLoading(true)
    const { data, error } = await supabaseAdmin.from('banners').select('*').order('ord', { ascending: true })
    if (error) console.error(error)
    else setBanners(data)
    setLoading(false)
  }

  async function handleAddBanner() {
    let imageUrl = ''
    if (newBanner.image) {
      const fileExt = newBanner.image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from('banners')
        .upload(fileName, newBanner.image)
      if (uploadError) {
        console.error(uploadError)
        return
      }
      imageUrl = `${supabaseAdmin.supabaseUrl}/storage/v1/object/public/banners/${fileName}`
    }

    const { data, error } = await supabaseAdmin.from('banners').insert([{
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      color: newBanner.color,
      image_url: imageUrl,
    }]).select().single()

    if (error) console.error(error)
    else {
      setBanners([...banners, data])
      setNewBanner({ title: '', subtitle: '', color: '', image: null })
    }
  }

  async function handleDeleteBanner(id) {
    const { error } = await supabaseAdmin.from('banners').delete().eq('id', id)
    if (error) console.error(error)
    else setBanners(banners.filter(b => b.id !== id))
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Управление баннерами</h1>

      {/* Форма добавления */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Заголовок"
          value={newBanner.title}
          onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
        />
        <input
          placeholder="Подзаголовок"
          value={newBanner.subtitle}
          onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
        />
        <input
          placeholder="Цвет (hex)"
          value={newBanner.color}
          onChange={e => setNewBanner({ ...newBanner, color: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setNewBanner({ ...newBanner, image: e.target.files[0] })}
        />
        <button onClick={handleAddBanner}>Добавить баннер</button>
      </div>

      {/* Список баннеров */}
      <div>
        {banners.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, backgroundColor: b.color, padding: 10, borderRadius: 8 }}>
            {b.image_url && <img src={b.image_url} alt="" style={{ width: 100, height: 60, objectFit: 'cover', marginRight: 10 }} />}
            <div style={{ flex: 1 }}>
              <strong>{b.title}</strong>
              <p>{b.subtitle}</p>
            </div>
            <button onClick={() => handleDeleteBanner(b.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}
