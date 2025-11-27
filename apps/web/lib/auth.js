// apps/web/lib/auth.js
import { supabase } from './supabase'

// Регистрация нового пользователя
export async function signUp(email, password, companyData) {
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
        is_approved: false // Вручную одобряем клиентов
      })

    if (profileError) throw profileError
  }

  return authData
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

// Подписка на изменения авторизации
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

