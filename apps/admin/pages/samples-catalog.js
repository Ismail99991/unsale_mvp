import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SamplesCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    fabric_type: '',
    composition: '',
    price_usd: '',
    description: '',
    image_url: ''
  })

  // Загружаем товары при монтировании
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) {
      setProducts(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('products')
      .insert([{
        ...formData,
        price_usd: parseFloat(formData.price_usd)
      }])

    if (!error) {
      // Очищаем форму и перезагружаем список
      setFormData({
        name: '',
        code: '',
        fabric_type: '',
        composition: '',
        price_usd: '',
        description: '',
        image_url: ''
      })
      loadProducts()
      alert('Товар успешно добавлен!')
    } else {
      alert('Ошибка при добавлении товара: ' + error.message)
    }
    setLoading(false)
  }

  async function deleteProduct(id) {
    if (!confirm('Удалить этот товар?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (!error) {
      loadProducts()
      alert('Товар удален!')
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Каталог образцов</h1>
        <p style={styles.subtitle}>Управление товарами для бесплатных образцов</p>
      </header>

      <div style={styles.layout}>
        {/* Форма добавления */}
        <section style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Добавить новый образец</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <input
                type="text"
                placeholder="Название ткани*"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Артикул*"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Тип ткани (Футер, Кулирка...)*"
                value={formData.fabric_type}
                onChange={(e) => setFormData({...formData, fabric_type: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Состав*"
                value={formData.composition}
                onChange={(e) => setFormData({...formData, composition: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Цена в USD*"
                value={formData.price_usd}
                onChange={(e) => setFormData({...formData, price_usd: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="URL изображения"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                style={styles.input}
              />
            </div>
            
            <textarea
              placeholder="Описание ткани"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={styles.textarea}
              rows="3"
            />

            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Добавление...' : 'Добавить в каталог'}
            </button>
          </form>
        </section>

        {/* Список товаров */}
        <section style={styles.listSection}>
          <h2 style={styles.sectionTitle}>
            Товары в каталоге ({products.length})
          </h2>

          {loading && <p style={styles.loading}>Загрузка...</p>}

          <div style={styles.productsList}>
            {products.map(product => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productHeader}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    style={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
                
                <div style={styles.productDetails}>
                  <p><strong>Артикул:</strong> {product.code}</p>
                  <p><strong>Тип:</strong> {product.fabric_type}</p>
                  <p><strong>Состав:</strong> {product.composition}</p>
                  <p><strong>Цена:</strong> ${product.price_usd}</p>
                  {product.description && (
                    <p><strong>Описание:</strong> {product.description}</p>
                  )}
                  {product.image_url && (
                    <p><strong>Изображение:</strong> {product.image_url}</p>
                  )}
                </div>

                <div style={styles.productMeta}>
                  <span style={styles.date}>
                    Добавлен: {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div style={styles.emptyState}>
              <p>Каталог пуст. Добавьте первый товар.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    color: '#115c5c',
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    margin: 0
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  formSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  listSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#115c5c',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 20px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  submitButton: {
    backgroundColor: '#8cc552',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  productCard: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f8f9fa'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  productName: {
    color: '#115c5c',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    flex: 1
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px'
  },
  productDetails: {
    marginBottom: '12px'
  },
  productDetailsText: {
    margin: '4px 0',
    fontSize: '14px',
    color: '#333'
  },
  productMeta: {
    borderTop: '1px solid #e9ecef',
    paddingTop: '12px'
  },
  date: {
    fontSize: '12px',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '20px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#666',
    padding: '40px'
  }
}
