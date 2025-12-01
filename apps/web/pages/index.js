import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [content, setContent] = useState({
    banners: [],
    categories: [],
    featuredProducts: [],
    advantages: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    setLoading(true)
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      setContent(data)
    } catch (err) {
      console.error('Ошибка загрузки контента:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Загрузка...</div>

  const { banners, categories, featuredProducts, advantages } = content

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Unsale</h1>
        <div style={styles.headerActions}>
          <button style={styles.iconButton}>🔔</button>
          <Link href="/auth" style={styles.loginButton}>
            Войти
          </Link>
        </div>
      </header>

      {/* Поисковая строка */}
      <div style={styles.searchBar}>
        <div style={styles.searchInput}>🔍 Поиск тканей...</div>
      </div>

      {/* Основной контент */}
      <main style={styles.main}>
        {activeTab === 'home' && (
          <>
            {/* Баннеры */}
            <section style={styles.bannersSection}>
              <div style={styles.bannersContainer}>
                {banners.map(banner => (
                  <div key={banner.id} style={{ ...styles.banner, backgroundColor: banner.color }}>
                    <div style={styles.bannerContent}>
                      <h3 style={styles.bannerTitle}>{banner.title}</h3>
                      <p style={styles.bannerSubtitle}>{banner.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Категории */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Категории</h2>
              <div style={styles.categoriesGrid}>
                {categories.map(category => (
                  <div key={category.id} style={styles.categoryCard}>
                    <div style={{ ...styles.categoryIcon, backgroundColor: category.color }}>
                      {category.icon}
                    </div>
                    <span style={styles.categoryName}>{category.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Преимущества */}
            <section style={styles.section}>
              <div style={styles.advantagesGrid}>
                {advantages.map((adv, i) => (
                  <div key={i} style={styles.advantageItem}>
                    <div style={styles.advantageIcon}>{adv.icon}</div>
                    <span style={styles.advantageText}>{adv.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Популярные товары */}
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Популярные ткани</h2>
                <button style={styles.seeAllButton}>Все</button>
              </div>
              <div style={styles.productsGrid}>
                {featuredProducts.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={{ ...styles.productColor, backgroundColor: product.color }}></div>
                    <div style={styles.productInfo}>
                      <h4 style={styles.productName}>{product.name}</h4>
                      <p style={styles.productPrice}>{product.price}/метр</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Остальные вкладки */}
        {activeTab === 'search' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Поиск тканей</h3>
            <p style={styles.comingSoon}>Функция поиска скоро будет доступна</p>
          </div>
        )}

        {activeTab === 'custom' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Индивидуальный заказ</h3>
            <p style={styles.comingSoon}>Заказ ткани по вашим образцам и Pantone</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Профиль</h3>
            <p style={styles.comingSoon}>Войдите в систему для доступа к личному кабинету</p>
            <Link href="/auth" style={styles.authButton}>
              Войти или зарегистрироваться
            </Link>
          </div>
        )}
      </main>

      {/* Нижнее меню */}
      <nav style={styles.bottomNav}>
        <button
          style={{ ...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('home')}
        >
          <div style={styles.navIcon}>🏠</div>
          <span style={styles.navLabel}>Главная</span>
        </button>

        <button
          style={{ ...styles.navItem, ...(activeTab === 'search' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('search')}
        >
          <div style={styles.navIcon}>🔍</div>
          <span style={styles.navLabel}>Поиск</span>
        </button>

        <Link href="/samples" style={styles.navItemLink}>
          <div style={styles.navItem}>
            <div style={styles.navIcon}>🧪</div>
            <span style={styles.navLabel}>Образцы</span>
          </div>
        </Link>

        <button
          style={{ ...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('profile')}
        >
          <div style={styles.navIcon}>👤</div>
          <span style={styles.navLabel}>Профиль</span>
        </button>
      </nav>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#fff', paddingBottom: '80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#115c5c' },
  logo: { color: 'white', fontSize: '20px', fontWeight: '700', margin: 0 },
  headerActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconButton: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'white' },
  loginButton: { color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
  searchBar: { padding: '12px 16px', backgroundColor: 'white', borderBottom: '1px solid #f0f0f0' },
  searchInput: { padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#666', fontSize: '14px' },
  main: { padding: '0' },
  bannersSection: { padding: '16px' },
  bannersContainer: { display: 'flex', gap: '12px', overflowX: 'auto' },
  banner: { minWidth: '280px', height: '120px', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center' },
  bannerContent: { color: 'white' },
  bannerTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' },
  bannerSubtitle: { fontSize: '14px', margin: 0, opacity: 0.9 },
  section: { padding: '16px', borderBottom: '1px solid #f0f0f0' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#115c5c', margin: 0 },
  seeAllButton: { color: '#8cc552', background: 'none', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  categoriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  categoryCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  categoryIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  categoryName: { fontSize: '12px', color: '#666', textAlign: 'center' },
  advantagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  advantageItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  advantageIcon: { fontSize: '16px' },
  advantageText: { fontSize: '12px', color: '#115c5c', fontWeight: '500' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  productCard: { border: '1px solid #e9ecef', borderRadius: '12px', overflow: 'hidden' },
  productColor: { height: '80px', width: '100%' },
  productInfo: { padding: '12px' },
  productName: { fontSize: '14px', fontWeight: '600', color: '#115c5c', margin: '0 0 4px 0' },
  productPrice: { fontSize: '14px', fontWeight: '600', color: '#8cc552', margin: 0 },
  tabContent: { padding: '40px 20px', textAlign: 'center' },
  comingSoon: { color: '#666', fontSize: '14px', margin: '0 0 20px 0' },
  authButton: { backgroundColor: '#8cc552', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-block' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', backgroundColor: 'white', borderTop: '1px solid #f0f0f0', padding: '8px 0', backdropFilter: 'blur(10px)' },
  navItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer' },
  navItemActive: { color: '#8cc552' },
  navIcon: { fontSize: '20px', marginBottom: '4px' },
  navLabel: { fontSize: '12px', fontWeight: '500' }
}
