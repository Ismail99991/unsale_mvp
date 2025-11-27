import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Создаем клиент с fallback значениями для билда
const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'example-key'
)

// Регистрация нового пользователя
export async function signUp(email, password, companyData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyData.companyName,
          inn: companyData.inn,
          manager_name: companyData.managerName
        }
      }
    })

    if (authError) throw authError

    // Создаем профиль после успешной регистрации
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          company_name: companyData.companyName,
          inn: companyData.inn,
          manager_name: companyData.managerName,
          is_approved: false
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw profileError
      }
    }

    return authData
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

// Вход пользователя
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
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
}

// Подписка на изменения авторизации
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
