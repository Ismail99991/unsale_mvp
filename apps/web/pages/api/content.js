// apps/web/pages/api/content.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('❌ Missing SUPABASE env vars for /api/content')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
})

const typeToTable = {
  banners: 'banners',
  categories: 'categories',
  featuredProducts: 'featured_products',
  advantages: 'advantages',
}

export default async function handler(req, res) {
  const { method } = req
  const { type } = req.query

  try {
    // GET все сразу
    if (method === 'GET' && !type) {
      const results = {}
      for (const key of Object.keys(typeToTable)) {
        const table = typeToTable[key]
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('ord', { ascending: true })
          .order('id', { ascending: true })

        if (error) {
          console.warn(`⚠ Table ${table} fetch error:`, error.message)
          results[key] = []
        } else {
          results[key] = data || []
        }
      }
      return res.status(200).json(results)
    }

    // GET конкретного типа
    if (method === 'GET' && typeToTable[type]) {
      const table = typeToTable[type]
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('ord', { ascending: true })
        .order('id', { ascending: true })

      if (error) {
        console.warn(`⚠ Table ${table} fetch error:`, error.message)
        return res.status(200).json([])
      }
      return res.status(200).json(data || [])
    }

    // POST — добавить элемент
    if (method === 'POST' && typeToTable[type]) {
      const { item } = req.body || {}
      if (!item) return res.status(400).json({ error: 'item required in body' })
      const { data, error } = await supabase.from(typeToTable[type]).insert([item]).select().single()
      if (error) throw error
      return res.status(201).json(data)
    }

    // PUT — обновить элемент
    if (method === 'PUT' && typeToTable[type]) {
      const { id, item } = req.body || {}
      if (!id || !item) return res.status(400).json({ error: 'id and item required in body' })
      const { data, error } = await supabase.from(typeToTable[type]).update(item).eq('id', id).select().single()
      if (error) throw error
      return res.status(200).json(data)
    }

    // DELETE — удалить элемент
    if (method === 'DELETE' && typeToTable[type]) {
      const { id } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required in body' })
      const { error } = await supabase.from(typeToTable[type]).delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    console.error('❌ API /content error:', err.message || err)
    res.status(500).json({ error: 'Server error — check logs' })
  }
}
