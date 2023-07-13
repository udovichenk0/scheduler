import dayjs from "dayjs";

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MIN_DATES_LENGTH = 12
export const MIN_MONTHS_LENGTH = 3
export function remainingDaysOfMonth() {
  let current = dayjs().date()
  const length = dayjs().endOf('month').date() - dayjs().date() < MIN_DATES_LENGTH ? dayjs().endOf('month').date() + 1 - dayjs().date() : MIN_DATES_LENGTH
  
  return new Array(length).fill(null).map(() => {
    const date = dayjs(new Date(dayjs().year(), dayjs().month(), current));
    current+=1
    return date;
  });
}

export function remainingMonthsOfYear(){
  let counter = dayjs().month() + 1
  const length = 11 - dayjs().month() < MIN_MONTHS_LENGTH ? dayjs().endOf('month').month() - dayjs().month() + 1 : MIN_MONTHS_LENGTH
  return new Array(length).fill(null)
  .map(() => {
    const date = dayjs(new Date(dayjs().year(), counter, 1))
    counter += 1
    return date
  })
}