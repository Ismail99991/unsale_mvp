import Link from 'next/link'

export default function AdminHome() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Unsale Admin</h1>
        <p style={styles.subtitle}>Панель управления контентом</p>
      </header>

      <nav style={styles.nav}>
        <Link href="/admin/banners" style={styles.navLink}>Баннеры</Link>
        <Link href="/admin/categories" style={styles.navLink}>Категории</Link>
        <Link href="/admin/featured-products" style={styles.navLink}>Популярные товары</Link>
        <Link href="/admin/advantages" style={styles.navLink}>Преимущества</Link>
      </nav>
    </div>
  )
}

const styles = {
  container: { padding: 20, fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 32, color: '#115c5c', margin: 0 },
  subtitle: { color: '#666', margin: 0 },
  nav: { display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20 },
  navLink: { textDecoration: 'none', color: '#115c5c', fontWeight: 600 }
}
