// apps/web/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Using fallback values for build.')
}

// Создаем клиент с fallback значениями для билда
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', 
  supabaseKey || 'example-key'
)
