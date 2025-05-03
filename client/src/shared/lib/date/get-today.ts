import dayjs from "dayjs"

export const getToday = () => {
  return dayjs().startOf("date")
}

export const getTomorrow = () => {
  return dayjs().add(1, "day").startOf("date")
}

export const getLater = () => {
  return dayjs().add(2, "hour")
}

export const getNextWeek = () => {
  return dayjs().add(1, "week").set("day", 1)
}

export const getNextWeekend = () => {
  return dayjs().add(1, "week").weekday(7)
}