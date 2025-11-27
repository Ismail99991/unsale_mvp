import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res)
  
  if (!session) {
    return res.status(401).json({ error: 'Не авторизован' })
  }

  // Здесь будет логика получения данных доставки из вашей БД
  const deliveryData = {
    deliveries: [
      {
        id: 1,
        orderNumber: 'ORD-001',
        status: 'delivered',
        statusText: 'Доставлен',
        address: 'Москва, ул. Примерная, д. 1',
        date: '2024-01-15',
        trackNumber: 'TRK123456789'
      }
    ]
  }

  res.status(200).json(deliveryData)
}
