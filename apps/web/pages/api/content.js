// apps/web/pages/api/content.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing SUPABASE env vars for /api/content')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
})

/**
 * Мы используем параметр `type` для выбора таблицы:
 * banners, categories, featuredProducts, advantages
 */
const typeToTable = {
  banners: 'banners',
  categories: 'categories',
  featuredProducts: 'featured_products',
  advantages: 'advantages'
}

export default async function handler(req, res) {
  const { method } = req
  // Для GET без body можно использовать ?type=banners
  const { type } = req.query

  if (!type || !typeToTable[type]) {
    // Для GET: если type не указан — вернём всё сразу
    if (method === 'GET' && !type) {
      try {
        const results = {}
        for (const k of Object.keys(typeToTable)) {
          const tbl = typeToTable[k]
          const { data, error } = await supabase.from(tbl).select('*').order('ord', { ascending: true }).order('id', { ascending: true })
          if (error) throw error
          results[k] = data
        }
        return res.status(200).json(results)
      } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message || 'server error' })
      }
    }
    return res.status(400).json({ error: 'type param required and must be one of: ' + Object.keys(typeToTable).join(', ') })
  }

  const table = typeToTable[type]

  try {
    if (method === 'GET') {
      const { data, error } = await supabase.from(table).select('*').order('ord', { ascending: true }).order('id', { ascending: true })
      if (error) throw error
      return res.status(200).json(data)
    }

    if (method === 'POST') {
      // body: { item: { title:..., name:..., ... } }
      const { item } = req.body || {}
      if (!item) return res.status(400).json({ error: 'item required in body' })
      const { data, error } = await supabase.from(table).insert([item]).select().single()
      if (error) throw error
      return res.status(201).json(data)
    }

    if (method === 'PUT') {
      // body: { id: number, item: {...} }
      const { id, item } = req.body || {}
      if (!id || !item) return res.status(400).json({ error: 'id and item required in body' })
      const { data, error } = await supabase.from(table).update(item).eq('id', id).select().single()
      if (error) throw error
      return res.status(200).json(data)
    }

    if (method === 'DELETE') {
      // body: { id: number }
      const { id } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required in body' })
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'server error' })
  }
}
