import Link from 'next/link'

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Unsale.ru</h1>
        <p style={styles.subtitle}>B2B платформа для оптовых закупок трикотажного полотна</p>
        
        <div style={styles.buttons}>
          <Link href="/auth" style={styles.primaryButton}>
            Вход для клиентов
          </Link>
          <Link href="/admin" style={styles.secondaryButton}>
            Админ-панель
          </Link>
        </div>
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
    backgroundColor: '#115c5c',
    padding: 20
  },
  hero: {
    textAlign: 'center',
    color: 'white'
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: '0 0 16px 0'
  },
  subtitle: {
    fontSize: 18,
    margin: '0 0 40px 0',
    opacity: 0.9
  },
  buttons: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    backgroundColor: '#8cc552',
    color: 'white',
    padding: '16px 32px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '16px 32px',
    border: '2px solid white',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16
  }
}
