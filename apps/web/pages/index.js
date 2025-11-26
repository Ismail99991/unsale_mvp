import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')

  // Моковые данные товаров для демонстрации
  const featuredProducts = [
    { id: 1, name: 'Футер 2-х нитка', price: '$3.20', composition: '100% хлопок' },
    { id: 2, name: 'Кулирка гладь', price: '$2.80', composition: '100% хлопок' },
    { id: 3, name: 'Меланж серый', price: '$3.75', composition: '90% хлопок, 10% полиэстер' },
    { id: 4, name: 'Рибана 1x1', price: '$3.10', composition: '95% хлопок, 5% эластан' }
  ]

  const advantages = [
    { 
      title: 'Прямые цены от производителя', 
      description: 'Работаем без посредников' 
    },
    { 
      title: 'Онлайн заказ 24/7', 
      description: 'Заказывайте в любое время' 
    },
    { 
      title: 'Персональные условия', 
      description: 'Скидки для постоянных клиентов' 
    },
    { 
      title: 'Собственная логистика', 
      description: 'Быстрая доставка по всей России' 
    }
  ]

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Unsale.ru</h1>
        <Link href="/auth" style={styles.loginButton}>
          Войти
        </Link>
      </header>

      {/* Основной контент */}
      <main style={styles.main}>
        {activeTab === 'home' && (
          <>
            {/* Герой-секция */}
            <section style={styles.hero}>
              <h2 style={styles.heroTitle}>Трикотажное полотно оптом</h2>
              <p style={styles.heroSubtitle}>Прямые поставки с фабрики для вашего бизнеса</p>
            </section>

            {/* Преимущества */}
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Почему выбирают нас</h3>
              <div style={styles.advantagesGrid}>
                {advantages.map((advantage, index) => (
                  <div key={index} style={styles.advantageCard}>
                    <div style={styles.advantageIcon}>✓</div>
                    <h4 style={styles.advantageTitle}>{advantage.title}</h4>
                    <p style={styles.advantageDesc}>{advantage.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Популярные товары */}
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Популярные ткани</h3>
              <div style={styles.productsGrid}>
                {featuredProducts.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}></div>
                    <h4 style={styles.productName}>{product.name}</h4>
                    <p style={styles.productComposition}>{product.composition}</p>
                    <p style={styles.productPrice}>{product.price}/метр</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'search' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Поиск тканей</h3>
            <input 
              type="text" 
              placeholder="Поиск по артикулу или названию..." 
              style={styles.searchInput}
            />
            <p style={styles.comingSoon}>Функция поиска скоро будет доступна</p>
          </div>
        )}

        {activeTab === 'custom' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Индивидуальный заказ</h3>
            <p style={styles.comingSoon}>
              Заказ ткани по вашим образцам и Pantone будет доступен после регистрации
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={styles.tabContent}>
            <h3 style={styles.sectionTitle}>Профиль</h3>
            <p style={styles.comingSoon}>
              Войдите в систему для доступа к личному кабинету
            </p>
            <Link href="/auth" style={styles.authButton}>
              Войти или зарегистрироваться
            </Link>
          </div>
        )}
      </main>

      {/* Нижнее меню в стиле iOS */}
      <nav style={styles.bottomNav}>
        <button 
          style={{...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {})}}
          onClick={() => setActiveTab('home')}
        >
          <div style={styles.navIcon}>🏠</div>
          <span style={styles.navLabel}>Главная</span>
        </button>
        
        <button 
          style={{...styles.navItem, ...(activeTab === 'search' ? styles.navItemActive : {})}}
          onClick={() => setActiveTab('search')}
        >
          <div style={styles.navIcon}>🔍</div>
          <span style={styles.navLabel}>Поиск</span>
        </button>
        
        <button 
          style={{...styles.navItem, ...(activeTab === 'custom' ? styles.navItemActive : {})}}
          onClick={() => setActiveTab('custom')}
        >
          <div style={styles.navIcon}>🎨</div>
          <span style={styles.navLabel}>Индивидуально</span>
        </button>
        
        <button 
          style={{...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {})}}
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
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    paddingBottom: '80px' // Место для нижнего меню
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0'
  },
  logo: {
    color: '#115c5c',
    fontSize: '20px',
    fontWeight: '700',
    margin: 0
  },
  loginButton: {
    color: '#8cc552',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px'
  },
  main: {
    padding: '20px'
  },
  hero: {
    textAlign: 'center',
    padding: '40px 0',
    marginBottom: '40px'
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#115c5c',
    margin: '0 0 12px 0'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 20px 0'
  },
  advantagesGrid: {
    display: 'grid',
    gap: '16px'
  },
  advantageCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  advantageIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#8cc552',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '16px'
  },
  advantageTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 8px 0'
  },
  advantageDesc: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  productCard: {
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  },
  productImage: {
    width: '100%',
    height: '80px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 4px 0'
  },
  productComposition: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0'
  },
  productPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#8cc552',
    margin: 0
  },
  tabContent: {
    padding: '40px 0',
    textAlign: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px'
  },
  comingSoon: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 20px 0'
  },
  authButton: {
    backgroundColor: '#8cc552',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    backgroundColor: 'white',
    borderTop: '1px solid #f0f0f0',
    padding: '8px 0',
    backdropFilter: 'blur(10px)'
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '8px 0',
    cursor: 'pointer'
  },
  navItemActive: {
    color: '#8cc552'
  },
  navIcon: {
    fontSize: '20px',
    marginBottom: '4px'
  },
  navLabel: {
    fontSize: '12px',
    fontWeight: '500'
  }
}
