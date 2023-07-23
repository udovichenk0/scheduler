import dayjs, { extend } from "dayjs"
import isToday from 'dayjs/plugin/isToday'
import isTommorow from 'dayjs/plugin/isTomorrow'
extend(isToday)
extend(isTommorow)
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function normilizeDate(date: Date) {
  if(dayjs(date).isSame(dayjs(), 'day')){
    return 'Today'
  }
  else if(dayjs(date).isTomorrow()){
    return 'Tomorrow'
  }
  else if(dayjs(date).isSame(dayjs(), 'year')){
    return `${months[dayjs(date).month()]} ${dayjs(date).date()}`
  }
  else {
    return `${months[dayjs(date).month()]} ${dayjs(date).date()} ${dayjs(date).year()}`
  }
}