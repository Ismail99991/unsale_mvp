import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase env vars are missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Регистрация нового пользователя
export async function signUp(email, password, companyData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyData.companyName,
          inn: companyData.inn,
          manager_name: companyData.managerName,
        },
      },
    })

    if (error) throw error
    // Профиль теперь создается ТРИГГЕРОМ в БД автоматически
    return data
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

// Вход пользователя
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Выход
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Получение текущего пользователя
export async function getCurrentUser() {
  return await supabase.auth.getUser()
}

// Получение профиля пользователя
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Profile fetch error:', err)
    return null
  }
}

// Подписка на изменения авторизации
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
