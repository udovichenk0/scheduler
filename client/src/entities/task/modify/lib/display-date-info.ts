import dayjs from "dayjs"

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function showDateTitle(date: Date) {
  const curDate = dayjs().date()
  const curMonth = dayjs().month()
  const curYear = dayjs().year()

  const dayjsDate = dayjs(date)
  const curYearAndMonth = curYear && curMonth
  if(dayjsDate.date() == curDate && curYearAndMonth){
    return 'Today'
  }
  else if(dayjsDate.date() == curDate + 1 && curYearAndMonth){
    return 'Tomorrow'
  }
  else if(dayjsDate.year() == curYear){
    return `${months[dayjsDate.month()]} ${dayjsDate.date()}`
  }
  else {
    return `${months[dayjsDate.month()]} ${dayjsDate.date()} ${dayjsDate.year()}`
  }
}