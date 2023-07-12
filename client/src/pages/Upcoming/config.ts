import dayjs from "dayjs";

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function daysOfCurrentMonth() {
  let current = dayjs().date()
  const length = dayjs().endOf('month').date() - dayjs().date() < 12 ? dayjs().endOf('month').date() + 1 - dayjs().date() : 12
  
  return new Array(length).fill(null).map(() => {
    const date = dayjs(new Date(dayjs().year(), dayjs().month(), current));
    current+=1
    return date;
  });
}
export function monthsOfCurrentYear(){
  let counter = dayjs().month() + 1
  const length = 11 - dayjs().month() < 3 ? dayjs().endOf('month').month() - dayjs().month() + 1 : 3
  return new Array(length).fill(null)
  .map(() => {
    const date = dayjs(new Date(dayjs().year(), counter, 1))
    counter += 1
    return date
  })
}