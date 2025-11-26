import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Samples() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [pantoneNumber, setPantoneNumber] = useState('')
  const [showPantoneHelp, setShowPantoneHelp] = useState(false)
  const router = useRouter()

  // Демо-товары для образцов
  const sampleProducts = [
    { id: 1, name: 'Футер 2-х нитка', code: 'FUT-001' },
    { id: 2, name: 'Кулирка гладь', code: 'KUL-001' },
    { id: 3, name: 'Меланж серый', code: 'MEL-001' },
    { id: 4, name: 'Рибана 1x1', code: 'RIB-001' },
    { id: 5, name: 'Футер 3-х нитка', code: 'FUT-002' },
    { id: 6, name: 'Бифлекс', code: 'BIF-001' }
  ]

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedProducts.length === 0) {
      alert('Выберите хотя бы один образец')
      return
    }
    // Здесь будет отправка заявки
    alert('Заявка на образцы отправлена! Мы свяжемся с вами для уточнения деталей.')
    router.push('/')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backButton}>← Назад</Link>
        <h1 style={styles.title}>Бесплатные образцы</h1>
        <div style={styles.placeholder}></div>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <h2 style={styles.heroTitle}>Получите образцы тканей</h2>
          <p style={styles.heroSubtitle}>Бесплатно доставим образцы для тестирования качества</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Выбор тканей */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Выберите ткани для образцов</h3>
            <div style={styles.productsGrid}>
              {sampleProducts.map(product => (
                <div 
                  key={product.id}
                  style={{
                    ...styles.productCard,
                    ...(selectedProducts.find(p => p.id === product.id) ? styles.productCardSelected : {})
                  }}
                  onClick={() => toggleProduct(product)}
                >
                  <div style={styles.productCheckbox}>
                    {selectedProducts.find(p => p.id === product.id) && '✓'}
                  </div>
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>{product.name}</h4>
                    <p style={styles.productCode}>{product.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Цвет */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Укажите нужный цвет</h3>
            
            <div style={styles.colorSection}>
              <input 
                type="text" 
                placeholder="Например: Pantone 19-4052"
                value={pantoneNumber}
                onChange={(e) => setPantoneNumber(e.target.value)}
                style={styles.input}
              />
              
              <button 
                type="button"
                onClick={() => setShowPantoneHelp(true)}
                style={styles.helpButton}
              >
                Не знаю номер цвета
              </button>
            </div>

            {showPantoneHelp && (
              <div style={styles.pantoneHelp}>
                <h4 style={styles.helpTitle}>Отправьте свой образец цвета</h4>
                <p style={styles.helpText}>
                  Пришлите нам физический образец цвета через партнерскую сеть ПВЗ:
                </p>
                
                <div style={styles.deliveryOptions}>
                  <div style={styles.deliveryOption}>
                    <div style={styles.optionIcon}>📦</div>
                    <div style={styles.optionInfo}>
                      <h5 style={styles.optionTitle}>Wildberries ПВЗ</h5>
                      <p style={styles.optionDesc}>
                        Сдайте образец в любой ПВЗ WB. Мы оплачиваем доставку!
                      </p>
                      <button 
                        type="button" 
                        style={styles.trackButton}
                        onClick={() => window.open('https://www.wildberries.ru/services/points', '_blank')}
                      >
                        Найти ПВЗ на карте
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setShowPantoneHelp(false)}
                  style={styles.closeHelp}
                >
                  Указать Pantone номер
                </button>
              </div>
            )}
          </section>

          {/* Информация о заказе */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Информация для доставки</h3>
            <div style={styles.infoGrid}>
              <input type="text" placeholder="ФИО" style={styles.input} required />
              <input type="tel" placeholder="Телефон" style={styles.input} required />
              <input type="email" placeholder="Email" style={styles.input} required />
              <input type="text" placeholder="Город" style={styles.input} required />
              <input type="text" placeholder="Название компании" style={styles.input} />
              <textarea placeholder="Комментарий к заказу" style={styles.textarea} rows="3" />
            </div>
          </section>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={selectedProducts.length === 0}
          >
            Заказать {selectedProducts.length} образцов бесплатно
          </button>

          <p style={styles.note}>
            После отправки заявки наш менеджер свяжется с вами в течение 2 часов для подтверждения
          </p>
        </form>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0'
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
  placeholder: {
    width: '60px'
  },
  main: {
    padding: '20px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  heroTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#115c5c',
    margin: '0 0 8px 0'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  section: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 16px 0'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  productCard: {
    border: '2px solid #e9ecef',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  productCardSelected: {
    borderColor: '#8cc552',
    backgroundColor: '#f8fff0'
  },
  productCheckbox: {
    width: '20px',
    height: '20px',
    border: '2px solid #ddd',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#8cc552'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 4px 0'
  },
  productCode: {
    fontSize: '12px',
    color: '#666',
    margin: 0
  },
  colorSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  helpButton: {
    backgroundColor: 'transparent',
    color: '#8cc552',
    border: '1px solid #8cc552',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  pantoneHelp: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '16px'
  },
  helpTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 8px 0'
  },
  helpText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 16px 0'
  },
  deliveryOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  deliveryOption: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  optionIcon: {
    fontSize: '24px',
    marginTop: '4px'
  },
  optionInfo: {
    flex: 1
  },
  optionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 4px 0'
  },
  optionDesc: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0'
  },
  trackButton: {
    backgroundColor: '#115c5c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  closeHelp: {
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    padding: '8px 0',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  submitButton: {
    backgroundColor: '#8cc552',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '12px'
  },
  note: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    margin: 0
  }
}
