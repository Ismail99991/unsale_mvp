export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { address } = req.body

  try {
    // Интеграция с API Яндекс Доставки
    const yandexResponse = await fetch('https://api.delivery.yandex.net/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.YANDEX_DELIVERY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'ваш складской адрес',
        destination: address,
        // другие параметры
      })
    })

    const data = await yandexResponse.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка расчета доставки' })
  }
}
