import dayjs from "dayjs";

export function dateToUnix(date: Date){
  return dayjs(date).unix()
}