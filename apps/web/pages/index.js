export default function Home() {
  return (
    <div style={{ padding: 50, fontFamily: 'Arial' }}>
      <h1>Unsale.ru</h1>
      <p>B2B платформа для оптовых закупок трикотажного полотна</p>
      <div>
        <a href="/auth" style={{ color: 'blue' }}>Вход для клиентов</a>
      </div>
      <div>
        <a href="/admin" style={{ color: 'gray' }}>Админ-панель</a>
      </div>
    </div>
  )
}
