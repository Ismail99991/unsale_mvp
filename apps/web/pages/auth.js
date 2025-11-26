import { useState } from 'react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)

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

        <form style={styles.form}>
          <input 
            type="email" 
            placeholder="Email" 
            style={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            style={styles.input}
            required
          />
          
          <button type="submit" style={styles.button}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        {!isLogin && (
          <p style={styles.hint}>
            Регистрация только для проверенных клиентов
          </p>
        )}
      </div>
    </div>
  )
}

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
    transition: 'background-color 0.2s'
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 20
  }
}
