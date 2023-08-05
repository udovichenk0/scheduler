import dayjs from "dayjs"

export const generateCalendar = (currentMonth = dayjs().month()) => {
  const year = dayjs().year()
  const firstDayOfMonth = dayjs(new Date(year, currentMonth - 1)).day()
  let current = 0 - firstDayOfMonth
  return Array.from({ length: 5 }, () => []).map(() => {
    return Array.from({ length: 7 }, () => null).map(() => {
      current += 1
      const currentDate = dayjs(new Date(year, currentMonth, current + 8))
      return {
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
      }
    })
  })
}
