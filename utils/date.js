// 0 = өнөөдөр, 1 = маргааш, -2 = 2 хоногийн өмнө (хэтэрсэн)
export function daysUntil(dueDate) {
  const [y, m, d] = dueDate.split('-').map(Number)
  const due = new Date(y, m - 1, d)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const oneDay = 1000 * 60 * 60 * 24 
  return Math.round((due - today) / oneDay)
}