import dayjs from "dayjs"

export const generateCalendar = (
  year = dayjs().year(),
  month = dayjs().month(),
) => {
  const firstDayOfMonth = dayjs(new Date(year, month)).day()
  let current = 0 - firstDayOfMonth
  return Array.from({ length: 5 }, () => []).map(() => {
    return Array.from({ length: 7 }, () => null).map(() => {
      current += 1
      const currentDate = dayjs(new Date(year, month, current))
      return {
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
      }
    })
  })
}
