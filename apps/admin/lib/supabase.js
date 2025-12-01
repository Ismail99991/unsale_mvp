// apps/admin/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Публичный URL Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Секретный ключ с правами на запись (Service Role Key)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables for Admin')
}

// Клиент админки для чтения и записи данных
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
