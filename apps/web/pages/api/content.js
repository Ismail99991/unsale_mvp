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

const typeToTable = {
  banners: 'banners',
  categories: 'categories',
  featuredProducts: 'featured_products',
  advantages: 'advantages',
}

export default async function handler(req, res) {
  const { method } = req

  try {
    if (method === 'GET') {
      const results = {}
      for (const key of Object.keys(typeToTable)) {
        const table = typeToTable[key]
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('ord', { ascending: true })
          .order('id', { ascending: true })
        if (error) throw error
        results[key] = data
      }
      return res.status(200).json(results)
    }

    if (method === 'POST') {
      const { type, item } = req.body || {}
      if (!type || !typeToTable[type] || !item) {
        return res.status(400).json({ error: 'type and item required in body' })
      }
      const { data, error } = await supabase
        .from(typeToTable[type])
        .insert([item])
        .select()
        .single()
      if (error) throw error
      return res.status(201).json(data)
    }

    if (method === 'PUT') {
      const { type, id, item } = req.body || {}
      if (!type || !typeToTable[type] || !id || !item) {
        return res.status(400).json({ error: 'type, id and item required in body' })
      }
      const { data, error } = await supabase
        .from(typeToTable[type])
        .update(item)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json(data)
    }

    if (method === 'DELETE') {
      const { type, id } = req.body || {}
      if (!type || !typeToTable[type] || !id) {
        return res.status(400).json({ error: 'type and id required in body' })
      }
      const { error } = await supabase.from(typeToTable[type]).delete().eq('id', id)
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
