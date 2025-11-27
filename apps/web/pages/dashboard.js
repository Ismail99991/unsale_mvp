import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, signOut } from '../utils/auth'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await getCurrentUser()
    if (!user) {
      router.push('/auth')
    } else {
      setUser(user)
      // Здесь позже загрузим профиль из базы
    }
  }

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return <div style={styles.loading}>Загрузка...</div>
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Личный кабинет</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Выйти
        </button>
      </header>
      
      <main style={styles.main}>
        <p>Добро пожаловать, {user.email}!</p>
        <p>Ваш аккаунт ожидает подтверждения администратором.</p>
        
        <div style={styles.features}>
          <h3>После подтверждения вам будут доступны:</h3>
          <ul>
            <li>📦 Полный каталог тканей</li>
            <li>🛒 Онлайн-заказы</li>
            <li>📊 История заказов</li>
            <li>🎨 Индивидуальные заказы</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee'
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  main: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  features: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  loading: {
    padding: '50px',
    textAlign: 'center'
  }
}
