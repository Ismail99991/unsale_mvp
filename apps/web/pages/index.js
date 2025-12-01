import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')

  // SWR для автообновления контента каждые 5 секунд
  const { data: content, error } = useSWR('/api/content', fetcher, { refreshInterval: 5000 })

  if (error) return <div style={{ padding: 20 }}>Ошибка загрузки данных</div>
  if (!content) return <div style={{ padding: 20 }}>Загрузка...</div>

  const { banners = [], categories = [], featuredProducts = [], advantages = [] } = content

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Unsale</h1>
        <div style={styles.headerActions}>
          <button style={styles.iconButton}>🔔</button>
          <Link href="/auth" style={styles.loginButton}>Войти</Link>
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
                    <div style={{ ...styles.categoryIcon, backgroundColor: category.color }}>{category.icon}</div>
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
            <Link href="/auth" style={styles.authButton}>Войти или зарегистрироваться</Link>
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

// --- Здесь можно оставить твои стили из предыдущего index.js ---
