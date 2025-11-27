import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Samples() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [pantoneNumber, setPantoneNumber] = useState('')
  const [showPantoneHelp, setShowPantoneHelp] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('courier') // 'courier' или 'pickup'
  const [deliveryCalculation, setDeliveryCalculation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    company: '',
    comment: ''
  })
  const router = useRouter()

  // Демо-товары для образцов
  const sampleProducts = [
    { id: 1, name: 'Футер 2-х нитка', code: 'FUT-001', weight: 0.2 },
    { id: 2, name: 'Кулирка гладь', code: 'KUL-001', weight: 0.15 },
    { id: 3, name: 'Меланж серый', code: 'MEL-001', weight: 0.18 },
    { id: 4, name: 'Рибана 1x1', code: 'RIB-001', weight: 0.16 },
    { id: 5, name: 'Футер 3-х нитка', code: 'FUT-002', weight: 0.25 },
    { id: 6, name: 'Бифлекс', code: 'BIF-001', weight: 0.12 }
  ]

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Расчет доставки через Яндекс API
  const calculateDelivery = async () => {
    if (!formData.city || !formData.address) {
      alert('Заполните город и адрес для расчета доставки')
      return
    }

    setLoading(true)
    try {
      const totalWeight = selectedProducts.reduce((sum, product) => sum + product.weight, 0)
      
      const response = await fetch('/api/delivery/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          address: `${formData.city}, ${formData.address}`,
          weight: Math.max(totalWeight, 0.5), // минимальный вес 0.5кг
          deliveryMethod: deliveryMethod,
          dimensions: {
            length: 20,
            width: 15,
            height: 5
          }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setDeliveryCalculation(data)
      } else {
        throw new Error('Ошибка расчета доставки')
      }
    } catch (error) {
      console.error('Ошибка расчета доставки:', error)
      alert('Ошибка при расчете доставки. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedProducts.length === 0) {
      alert('Выберите хотя бы один образец')
      return
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.city) {
      alert('Заполните обязательные поля')
      return
    }

    setLoading(true)
    try {
      // Создаем заявку на доставку
      const deliveryResponse = await fetch('/api/delivery/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: selectedProducts,
          pantone: pantoneNumber,
          client: formData,
          delivery: {
            method: deliveryMethod,
            calculation: deliveryCalculation,
            address: `${formData.city}, ${formData.address}`
          }
        })
      })

      if (deliveryResponse.ok) {
        const result = await deliveryResponse.json()
        
        alert(`Заявка на образцы отправлена! ${deliveryCalculation ? `Стоимость доставки: ${deliveryCalculation.cost} ₽` : 'Мы свяжемся с вами для уточнения деталей доставки'}`)
        router.push('/')
      } else {
        throw new Error('Ошибка создания заявки')
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error)
      alert('Ошибка при отправке заявки. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const totalWeight = selectedProducts.reduce((sum, product) => sum + product.weight, 0)

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
                    <p style={styles.productWeight}>Вес: {product.weight}кг</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedProducts.length > 0 && (
              <div style={styles.weightInfo}>
                Общий вес образцов: <strong>{totalWeight.toFixed(2)}кг</strong>
              </div>
            )}
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
              <input 
                type="text" 
                name="name"
                placeholder="ФИО *" 
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input} 
                required 
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Телефон *" 
                value={formData.phone}
                onChange={handleInputChange}
                style={styles.input} 
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email *" 
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input} 
                required 
              />
              <input 
                type="text" 
                name="city"
                placeholder="Город *" 
                value={formData.city}
                onChange={handleInputChange}
                style={styles.input} 
                required 
              />
              <input 
                type="text" 
                name="address"
                placeholder="Адрес доставки *" 
                value={formData.address}
                onChange={handleInputChange}
                style={styles.input} 
                required 
              />
              <input 
                type="text" 
                name="company"
                placeholder="Название компании" 
                value={formData.company}
                onChange={handleInputChange}
                style={styles.input} 
              />
              <textarea 
                name="comment"
                placeholder="Комментарий к заказу" 
                value={formData.comment}
                onChange={handleInputChange}
                style={styles.textarea} 
                rows="3" 
              />
            </div>
          </section>

          {/* Доставка */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Способ доставки</h3>
            
            <div style={styles.deliveryMethods}>
              <label style={styles.deliveryMethod}>
                <input
                  type="radio"
                  name="delivery"
                  value="courier"
                  checked={deliveryMethod === 'courier'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <div style={styles.methodContent}>
                  <div style={styles.methodIcon}>🚗</div>
                  <div style={styles.methodInfo}>
                    <h4 style={styles.methodTitle}>Курьерская доставка</h4>
                    <p style={styles.methodDesc}>Доставка курьером до двери</p>
                  </div>
                </div>
              </label>

              <label style={styles.deliveryMethod}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <div style={styles.methodContent}>
                  <div style={styles.methodIcon}>🏪</div>
                  <div style={styles.methodInfo}>
                    <h4 style={styles.methodTitle}>Пункт выдачи</h4>
                    <p style={styles.methodDesc}>Самовывоз из пункта выдачи</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Расчет доставки */}
            {(formData.city && formData.address) && (
              <div style={styles.deliveryCalculation}>
                <button 
                  type="button"
                  onClick={calculateDelivery}
                  disabled={loading}
                  style={styles.calculateButton}
                >
                  {loading ? 'Расчет...' : 'Рассчитать стоимость доставки'}
                </button>

                {deliveryCalculation && (
                  <div style={styles.calculationResult}>
                    <h4 style={styles.resultTitle}>Стоимость доставки:</h4>
                    <div style={styles.resultDetails}>
                      <div style={styles.resultItem}>
                        <span>Способ:</span>
                        <span>{deliveryCalculation.type}</span>
                      </div>
                      <div style={styles.resultItem}>
                        <span>Стоимость:</span>
                        <strong style={styles.resultPrice}>{deliveryCalculation.cost} ₽</strong>
                      </div>
                      <div style={styles.resultItem}>
                        <span>Срок:</span>
                        <span>{deliveryCalculation.days} дней</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={selectedProducts.length === 0 || loading}
          >
            {loading ? 'Отправка...' : `Заказать ${selectedProducts.length} образцов бесплатно`}
            {deliveryCalculation && (
              <span style={styles.deliveryCost}>
                + доставка {deliveryCalculation.cost} ₽
              </span>
            )}
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
    margin: '0 0 2px 0'
  },
  productWeight: {
    fontSize: '11px',
    color: '#999',
    margin: 0
  },
  weightInfo: {
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center'
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
  deliveryMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  deliveryMethod: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  methodContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  methodIcon: {
    fontSize: '24px'
  },
  methodInfo: {
    flex: 1
  },
  methodTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 4px 0'
  },
  methodDesc: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  deliveryCalculation: {
    marginTop: '16px'
  },
  calculateButton: {
    backgroundColor: '#115c5c',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '600'
  },
  calculationResult: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#e8f5e8',
    borderRadius: '8px',
    border: '1px solid #d4edda'
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#115c5c',
    margin: '0 0 12px 0'
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px'
  },
  resultPrice: {
    color: '#8cc552',
    fontSize: '16px',
    fontWeight: '600'
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
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  deliveryCost: {
    fontSize: '14px',
    opacity: 0.9,
    fontWeight: 'normal'
  },
  note: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    margin: 0
  }
}
