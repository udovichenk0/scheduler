import dayjs from "dayjs";

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MIN_DATES_LENGTH = 12
export const MIN_MONTHS_LENGTH = 3
export function remainingDaysOfMonth() {
  let dayCounter = dayjs().date()
  const DAYS_IN_MONTH = dayjs().daysInMonth()
  const remainingDays = DAYS_IN_MONTH - dayjs().date()

  const lengthOfDaysToShow = remainingDays < MIN_DATES_LENGTH ? remainingDays : MIN_DATES_LENGTH

  return new Array(lengthOfDaysToShow).fill(null).map(() => {
    const date = dayjs().date(dayCounter).startOf('date')
    dayCounter+=1
    return date;
  });
}

export function remainingMonthsOfYear(){
  const nextMonth = dayjs().month() + 1
  let monthCounter = nextMonth
  const MONTHS_IN_YEAR = 11
  const remainingMonths = MONTHS_IN_YEAR - dayjs().month()

  const lengthOfMonthToShow = MONTHS_IN_YEAR - dayjs().month() < MIN_MONTHS_LENGTH ? remainingMonths : MIN_MONTHS_LENGTH
  
  return new Array(lengthOfMonthToShow).fill(null)
  .map(() => {
    const date = dayjs().month(monthCounter).startOf('month')
    monthCounter += 1
    return date
  })
}