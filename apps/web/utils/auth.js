import { supabase } from './supabase'

// Регистрация нового пользователя
export async function signUp(email, password, companyData) {
  try {
    // 1. Регистрируем пользователя в Auth
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

    // 2. После успешной регистрации создаем профиль
    if (authData.user) {
      // Ждем немного чтобы Auth система обработала пользователя
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          company_name: companyData.companyName,
          inn: companyData.inn,
          manager_name: companyData.managerName,
          is_approved: false
        })
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Если ошибка RLS, пробуем через функцию
        await createProfileViaFunction(authData.user.id, companyData)
      }
    }

    return authData
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

// Альтернативный метод через Edge Function если RLS блокирует
async function createProfileViaFunction(userId, companyData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        company_name: companyData.companyName,
        inn: companyData.inn,
        manager_name: companyData.managerName
      })
    })
    
    if (!response.ok) throw new Error('Failed to create profile via function')
  } catch (error) {
    console.error('Edge function error:', error)
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
export function getCurrentUser() {
  return supabase.auth.getUser()
}

// Получение профиля пользователя
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Подписка на изменения авторизации
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
