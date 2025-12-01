// apps/web/pages/api/content.js
import { createClient } from '@supabase/supabase-js'

// Используем правильные env переменные
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing SUPABASE env vars for /api/content')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
})

// Таблицы
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
    // GET без type — возвращаем всё сразу
    if (method === 'GET' && !type) {
      const results = {}
      for (const k of Object.keys(typeToTable)) {
        const tbl = typeToTable[k]
        const { data, error } = await supabase
          .from(tbl)
          .select('*')
          .order('id', { ascending: true }) // безопасно
        if (error) throw error
        results[k] = data
      }
      return res.status(200).json(results)
    }

    // GET с type
    if (method === 'GET' && typeToTable[type]) {
      const table = typeToTable[type]
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('id', { ascending: true })
      if (error) throw error
      return res.status(200).json(data)
    }

    // POST — добавление нового
    if (method === 'POST') {
      if (!typeToTable[type]) return res.status(400).json({ error: 'Invalid type' })
      const { item } = req.body || {}
      if (!item) return res.status(400).json({ error: 'item required in body' })
      const { data, error } = await supabase.from(typeToTable[type]).insert([item]).select().single()
      if (error) throw error
      return res.status(201).json(data)
    }

    // PUT — обновление
    if (method === 'PUT') {
      if (!typeToTable[type]) return res.status(400).json({ error: 'Invalid type' })
      const { id, item } = req.body || {}
      if (!id || !item) return res.status(400).json({ error: 'id and item required in body' })
      const { data, error } = await supabase
        .from(typeToTable[type])
        .update(item)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json(data)
    }

    // DELETE — удаление
    if (method === 'DELETE') {
      if (!typeToTable[type]) return res.status(400).json({ error: 'Invalid type' })
      const { id } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id required in body' })
      const { error } = await supabase.from(typeToTable[type]).delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    // метод не поддерживается
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    console.error('Supabase API error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}
