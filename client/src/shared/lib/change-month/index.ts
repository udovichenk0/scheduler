import dayjs from "dayjs"

export const changeMonth = (currentMonth = dayjs().month()) => {
  const year = dayjs().year()
  const firstDayOfMonth = dayjs(new Date(year, currentMonth, 1)).day()
  let current = 0 - firstDayOfMonth
  return new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      current+=1
      const currentDate = dayjs(new Date(year, currentMonth, current + 8))
      return {
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year()
      }
    })
  })
}