import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCurrentUser, signOut, getUserProfile } from '../../utils/auth'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user }, error } = await getCurrentUser()
      
      if (error || !user) {
        router.push('/auth')
        return
      }

      // Получаем профиль из базы
      try {
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile)
        setUser({
          ...user,
          isApproved: userProfile?.is_approved || false
        })
      } catch (profileError) {
        console.error('Profile fetch error:', profileError)
        // Если профиль не найден, используем базовые данные
        setUser({
          ...user,
          isApproved: false
        })
      }
      
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/auth')
    }
  }

  async function handleLogout() {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Загрузка...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backButton}>← Назад</Link>
        <h1 style={styles.title}>Личный кабинет</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Выйти
        </button>
      </header>

      {/* Навигация по разделам */}
      <nav style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'profile' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('profile')}
        >
          👤 Профиль
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'delivery' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('delivery')}
        >
          🚚 Доставка
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'orders' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('orders')}
        >
          📦 Заказы
        </button>
      </nav>
      
      <main style={styles.main}>
        {/* Раздел профиля */}
        {activeTab === 'profile' && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Информация о профиле</h2>
            <div style={styles.profileInfo}>
              <div style={styles.infoItem}>
                <strong>Email:</strong> {user.email}
              </div>
              <div style={styles.infoItem}>
                <strong>Статус:</strong> 
                <span style={user.isApproved ? styles.statusApproved : styles.statusPending}>
                  {user.isApproved ? '✅ Подтвержден' : '⏳ Ожидает подтверждения'}
                </span>
              </div>
              <div style={styles.infoItem}>
                <strong>Дата регистрации:</strong> {new Date().toLocaleDateString('ru-RU')}
              </div>
            </div>
            
            <div style={styles.features}>
              <h3 style={styles.featuresTitle}>После подтверждения вам будут доступны:</h3>
              <ul style={styles.featuresList}>
                <li>📦 Полный каталог тканей с ценами</li>
                <li>🛒 Онлайн-заказы и резерв</li>
                <li>📊 История заказов и статусы</li>
                <li>🎨 Индивидуальные заказы по образцам</li>
                <li>🚚 Управление доставкой Яндекс</li>
                <li>💳 Персональные условия оплаты</li>
              </ul>
            </div>

            {!user.isApproved && (
              <div style={styles.warning}>
                <h4>⏳ Ожидайте подтверждения</h4>
                <p>Наш менеджер свяжется с вами для подтверждения аккаунта в течение 24 часов.</p>
              </div>
            )}
          </div>
        )}

        {/* Раздел доставки */}
        {activeTab === 'delivery' && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Управление доставкой</h2>
            
            {!user.isApproved ? (
              <div style={styles.warning}>
                <p>⚠️ Для доступа к управлению доставкой необходимо подтверждение аккаунта администратором.</p>
              </div>
            ) : (
              <>
                {/* Калькулятор доставки */}
                <div style={styles.deliverySection}>
                  <h3 style={styles.subsectionTitle}>Калькулятор доставки</h3>
                  <div style={styles.calculator}>
                    <input 
                      type="text" 
                      placeholder="Введите адрес доставки (город, улица, дом)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={styles.input}
                    />
                    <button 
                      style={styles.calculateButton}
                      onClick={calculateDelivery}
                      disabled={loading}
                    >
                      {loading ? 'Расчет...' : 'Рассчитать стоимость'}
                    </button>
                  </div>

                  {deliveryCalculation && (
                    <div style={styles.calculationResult}>
                      <h4>Результат расчета:</h4>
                      <div style={styles.resultItem}>
                        <span>Стоимость доставки:</span>
                        <strong>{deliveryCalculation.cost} ₽</strong>
                      </div>
                      <div style={styles.resultItem}>
                        <span>Срок доставки:</span>
                        <strong>{deliveryCalculation.days} дней</strong>
                      </div>
                      <div style={styles.resultItem}>
                        <span>Тип доставки:</span>
                        <strong>{deliveryCalculation.type}</strong>
                      </div>
                      <button 
                        style={styles.createDeliveryButton}
                        onClick={createDeliveryRequest}
                        disabled={loading}
                      >
                        {loading ? 'Создание...' : 'Создать заявку на доставку'}
                      </button>
                    </div>
                  )}
                </div>

                {/* История доставок */}
                <div style={styles.deliverySection}>
                  <h3 style={styles.subsectionTitle}>История доставок</h3>
                  {loading ? (
                    <div style={styles.loadingSmall}>Загрузка...</div>
                  ) : deliveryData && deliveryData.deliveries && deliveryData.deliveries.length > 0 ? (
                    <div style={styles.deliveriesList}>
                      {deliveryData.deliveries.map(delivery => (
                        <div key={delivery.id} style={styles.deliveryCard}>
                          <div style={styles.deliveryHeader}>
                            <span style={styles.deliveryId}>Заказ #{delivery.orderNumber}</span>
                            <span style={{
                              ...styles.deliveryStatus,
                              ...styles[`status${delivery.status}`]
                            }}>
                              {delivery.statusText}
                            </span>
                          </div>
                          <p style={styles.deliveryAddress}>{delivery.address}</p>
                          <p style={styles.deliveryDate}>Дата: {delivery.date}</p>
                          {delivery.cost && (
                            <p style={styles.deliveryCost}>Стоимость: {delivery.cost} ₽</p>
                          )}
                          {delivery.trackNumber && (
                            <p style={styles.trackNumber}>
                              Трек номер: <strong>{delivery.trackNumber}</strong>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.noData}>У вас пока нет заказов с доставкой</p>
                  )}
                </div>

                {/* Настройки доставки */}
                <div style={styles.deliverySection}>
                  <h3 style={styles.subsectionTitle}>Настройки доставки</h3>
                  <div style={styles.settings}>
                    <label style={styles.settingItem}>
                      <input type="checkbox" defaultChecked />
                      <span>Email-уведомления о статусе доставки</span>
                    </label>
                    <label style={styles.settingItem}>
                      <input type="checkbox" defaultChecked />
                      <span>SMS-уведомления о доставке</span>
                    </label>
                    <label style={styles.settingItem}>
                      <input type="checkbox" />
                      <span>Автоматический расчет при заказе</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Раздел заказов */}
        {activeTab === 'orders' && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>История заказов</h2>
            {!user.isApproved ? (
              <div style={styles.warning}>
                <p>⚠️ Для просмотра истории заказов необходимо подтверждение аккаунта.</p>
              </div>
            ) : (
              <div style={styles.ordersPlaceholder}>
                <div style={styles.placeholderIcon}>📦</div>
                <h3>История заказов</h3>
                <p>Здесь будет отображаться история ваших заказов, статусы и детали</p>
                <div style={styles.comingSoon}>
                  Функция находится в разработке и будет доступна в ближайшее время
                </div>
              </div>
            )}
          </div>
        )}
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
    padding: '16px 20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee'
  },
  backButton: {
    color: '#115c5c',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px'
  },
  title: {
    color: '#115c5c',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee'
  },
  tab: {
    flex: 1,
    padding: '16px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    fontSize: '14px',
    fontWeight: '500'
  },
  tabActive: {
    borderBottomColor: '#8cc552',
    color: '#8cc552',
    fontWeight: '600'
  },
  main: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 24px 0'
  },
  profileInfo: {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  infoItem: {
    marginBottom: '12px',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusApproved: {
    color: '#28a745',
    fontWeight: '600'
  },
  statusPending: {
    color: '#ffc107',
    fontWeight: '600'
  },
  features: {
    marginTop: '30px'
  },
  featuresTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#115c5c',
    marginBottom: '16px'
  },
  featuresList: {
    lineHeight: '2',
    paddingLeft: '20px',
    fontSize: '15px',
    color: '#555'
  },
  warning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    padding: '16px',
    color: '#856404',
    marginTop: '20px'
  },
  deliverySection: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #eee'
  },
  subsectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 16px 0'
  },
  calculator: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  calculateButton: {
    backgroundColor: '#8cc552',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px'
  },
  calculationResult: {
    backgroundColor: '#e8f5e8',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '16px',
    border: '1px solid #d4edda'
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '16px'
  },
  createDeliveryButton: {
    backgroundColor: '#115c5c',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginTop: '16px',
    width: '100%'
  },
  deliveriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  deliveryCard: {
    padding: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa'
  },
  deliveryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  deliveryId: {
    fontWeight: '600',
    color: '#115c5c',
    fontSize: '16px'
  },
  deliveryStatus: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusdelivered: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  deliveryAddress: {
    margin: '8px 0',
    color: '#666',
    fontSize: '15px'
  },
  deliveryDate: {
    margin: '4px 0',
    fontSize: '14px',
    color: '#999'
  },
  deliveryCost: {
    margin: '4px 0',
    fontSize: '15px',
    color: '#8cc552',
    fontWeight: '600'
  },
  trackNumber: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    color: '#115c5c'
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  ordersPlaceholder: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  comingSoon: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#666',
    fontSize: '14px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
  loading: {
    fontSize: '18px',
    color: '#666'
  },
  loadingSmall: {
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  }
}
