import dayjs from "dayjs"

export const getToday = () => {
  return dayjs().startOf("date").toDate()
}
