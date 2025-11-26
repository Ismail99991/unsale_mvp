import Link from 'next/link'

export default function AdminHome() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Unsale Admin</h1>
        <p style={styles.subtitle}>Панель управления B2B платформой</p>
      </header>

      <div style={styles.menuGrid}>
        <Link href="/samples-catalog" style={styles.menuCard}>
          <div style={styles.menuIcon}>📦</div>
          <h3 style={styles.menuTitle}>Каталог образцов</h3>
          <p style={styles.menuDesc}>Управление товарами для бесплатных образцов</p>
        </Link>

        <div style={styles.menuCard}>
          <div style={styles.menuIcon}>👥</div>
          <h3 style={styles.menuTitle}>Клиенты</h3>
          <p style={styles.menuDesc}>Управление клиентами и заявками (скоро)</p>
        </div>

        <div style={styles.menuCard}>
          <div style={styles.menuIcon}>📊</div>
          <h3 style={styles.menuTitle}>Аналитика</h3>
          <p style={styles.menuDesc}>Статистика и отчеты (скоро)</p>
        </div>

        <div style={styles.menuCard}>
          <div style={styles.menuIcon}>⚙️</div>
          <h3 style={styles.menuTitle}>Настройки</h3>
          <p style={styles.menuDesc}>Настройки платформы (скоро)</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: {
    color: '#115c5c',
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 12px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '18px',
    margin: 0
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  menuCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  menuIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  menuTitle: {
    color: '#115c5c',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0'
  },
  menuDesc: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5'
  }
}
