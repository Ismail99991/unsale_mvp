import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signUp, signIn, getCurrentUser } from '../lib/auth'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [inn, setInn] = useState('')
  const [managerName, setManagerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const router = useRouter()

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await getCurrentUser()
    if (user) {
      router.push('/dashboard') // Перенаправляем если уже авторизован
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // Вход
        await signIn(email, password)
        setMessage('Успешный вход! Перенаправляем...')
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        // Регистрация
        await signUp(email, password, {
          companyName,
          inn,
          managerName
        })
        setMessage('Регистрация успешна! Проверьте email для подтверждения.')
      }
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Unsale.ru</h1>
        <p style={styles.subtitle}>B2B платформа для текстильной промышленности</p>
        
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(isLogin ? styles.activeTab : {})}}
            onClick={() => setIsLogin(true)}
          >
            Войти
          </button>
          <button 
            style={{...styles.tab, ...(!isLogin ? styles.activeTab : {})}}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Название компании" 
                style={styles.input}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="ИНН" 
                style={styles.input}
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="ФИО менеджера" 
                style={styles.input}
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                required
              />
            </>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.hint,
            color: message.includes('Ошибка') ? '#ff4444' : '#8cc552'
          }}>
            {message}
          </p>
        )}

        {!isLogin && (
          <p style={styles.hint}>
            После регистрации мы свяжемся с вами для подтверждения аккаунта
          </p>
        )}
      </div>
    </div>
  )
}

// Стили остаются прежними...
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  card: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: 400
  },
  title: {
    color: '#115c5c',
    textAlign: 'center',
    margin: '0 0 8px 0',
    fontSize: 28,
    fontWeight: 600
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    margin: '0 0 30px 0',
    fontSize: 14
  },
  tabs: {
    display: 'flex',
    marginBottom: 30,
    borderBottom: '1px solid #eee'
  },
  tab: {
    flex: 1,
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    color: '#666'
  },
  activeTab: {
    color: '#115c5c',
    borderBottom: '2px solid #8cc552'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    backgroundColor: '#8cc552',
    color: 'white',
    padding: '14px 20px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    opacity: 1
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 20
  }
}
