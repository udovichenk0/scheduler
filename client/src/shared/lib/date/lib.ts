import dayjs, { Dayjs } from "dayjs"

type InputDate = Dayjs | Date | string
export class SDate {
  d: Dayjs
  constructor(date?: Nullable<Date | string | SDate | Dayjs>) {
    if (date instanceof SDate) {
      this.d = date.d
      return
    }
    if (typeof date === "string" || date instanceof Date || !date) {
      this.d = this.getDate(date)
      return
    }
    this.d = date
  }

  getDate = (date?: Nullable<Date | string>) => {
    if (date) return dayjs(date)
    return dayjs()
  }

  get dayOfMonth() {
    return this.d.date()
  }

  get year() {
    return this.d.year()
  }
  get day() {
    return this.d.day()
  }
  get month() {
    return this.d.month()
  }
  get date() {
    return this.d.date()
  }
  get hour() {
    return this.d.hour()
  }
  get minute() {
    return this.d.minute()
  }
  get isToday() {
    return this.d.isToday()
  }

  get isTomorrow() {
    return this.d.isTomorrow()
  }

  get isBeforeToday() {
    return this.d.isBefore(getToday().toDate(), "date")
  }
  get isAfterToday() {
    return this.d.isAfter(getToday().toDate(), "date")
  }
  parseDate(date: InputDate | SDate) {
    if (!date) throw new Error("Invalid date")
    if (date instanceof Date) return dayjs(date)
    if (date instanceof SDate) return date.d
    if (this.isValid(date)) return dayjs(date)
    throw new Error("Invalid date")
  }
  toDate() {
    return this.d.toDate()
  }
  toString() {
    return this.d.toString()
  }
  isValid(input: any) {
    return dayjs(input).isValid()
  }
  isBeforeDate(date: SDate | Date) {
    return this.d.isBefore(this.parseDate(date), "date")
  }
  isBefore(date: SDate | Date) {
    return this.d.isBefore(this.parseDate(date))
  }
  isAfter(date: SDate | Date) {
    return this.d.isAfter(this.parseDate(date))
  }
  isAfterDate(date: SDate | Date) {
    return this.d.isAfter(this.parseDate(date), "date")
  }
  isSameOrAfter(date: SDate | Date) {
    return this.d.isSameOrAfter(this.parseDate(date))
  }
  isSameDateOrAfter(date: SDate | Date) {
    return this.d.isSameOrAfter(this.parseDate(date), "date")
  }
  isSameDateOrBefore(date: SDate | Date) {
    return this.d.isSameOrBefore(this.parseDate(date), "date")
  }
  isSameDay(date: SDate | Date) {
    return this.d.isSame(this.parseDate(date), "day")
  }
  isSameDate(date: SDate | Date) {
    return this.d.isSame(this.parseDate(date), "date")
  }
  isSameYear(date: SDate | Date) {
    return this.d.isSame(this.parseDate(date), "year")
  }
  isSameMonth(date: SDate | Date) {
    return this.d.isSame(this.parseDate(date), "month")
  }

  setDate(date: number) {
    return new SDate(this.d.date(date))
  }
  setDay(day: number) {
    return new SDate(this.d.day(day))
  }

  setHour(hour: number) {
    return new SDate(this.d.hour(hour))
  }
  setMinute(minute: number) {
    return new SDate(this.d.minute(minute))
  }
  setSecond(second: number) {
    return new SDate(this.d.second(second))
  }

  setMonth(month: number) {
    return new SDate(this.d.month(month))
  }
  addHour(hour: number) {
    return new SDate(this.d.add(hour, "hour"))
  }
  addDay(day: number) {
    return new SDate(this.d.add(day, "day"))
  }
  subDay(day: number) {
    return new SDate(this.d.subtract(day, "day"))
  }
  subMonth(month: number) {
    return new SDate(this.d.subtract(month, "month"))
  }
  addWeek(day: number) {
    return new SDate(this.d.add(day, "week"))
  }
  addMonth(month: number) {
    return new SDate(this.d.add(month, "month"))
  }
  addYear(day: number) {
    return new SDate(this.d.add(day, "year"))
  }

  startDate() {
    return new SDate(this.d.startOf("date"))
  }

  startMonth() {
    return new SDate(this.d.startOf("month"))
  }
  endMonth() {
    return new SDate(this.d.endOf("month"))
  }

  startYear() {
    return new SDate(this.d.startOf("year"))
  }
  endYear() {
    return new SDate(this.d.endOf("year"))
  }

  toUnix() {
    return this.d.unix()
  }
  format(format: string) {
    return this.d.format(format)
  }

  get hasTime() {
    const hour = this.d.hour()
    const minute = this.d.minute()
    const second = this.d.second()

    return !!hour || !!minute || !!second
  }
  dayDiff(date: SDate | Date) {
    return this.d.diff(this.parseDate(date), "day")
  }
}

export const sdate = (date?: Nullable<Date | string>) => {
  return new SDate(date)
}

export const getToday = () => {
  return sdate().startDate()
}

export const getTomorrow = () => {
  return sdate().addDay(1).startDate()
}

export const getLater = () => {
  return sdate().addHour(2)
}

export const getNextWeek = () => {
  return sdate().addWeek(1).setDay(1)
}

export const getNextWeekend = () => {
  return sdate(dayjs().add(1, "week").weekday(7).toDate())
}

export const getSunday = () => {
  const day = dayjs().day()
  if (day >= 0) {
    return dayjs().weekday(7).toDate()
  }
  return dayjs().weekday(0).toDate()
}
export const getMonday = () => {
  const day = dayjs().day()
  if (day >= 1) {
    return dayjs().weekday(8).toDate()
  }
  return dayjs().weekday(1).toDate()
}
export const getTuesday = () => {
  const day = dayjs().day()
  if (day >= 2) {
    return dayjs().weekday(9).toDate()
  }
  return dayjs().weekday(2).toDate()
}
export const getWednesday = () => {
  const day = dayjs().day()
  if (day >= 3) {
    return dayjs().weekday(10).toDate()
  }
  return dayjs().weekday(3).toDate()
}
export const getThursday = () => {
  const day = dayjs().day()
  if (day >= 4) {
    return dayjs().weekday(11).toDate()
  }
  return dayjs().weekday(4).toDate()
}
export const getFriday = () => {
  const day = dayjs().day()
  if (day >= 5) {
    return dayjs().weekday(12).toDate()
  }
  return dayjs().weekday(5).toDate()
}
export const getSaturday = () => {
  const day = dayjs().day()
  if (day >= 6) {
    return dayjs().weekday(13).toDate()
  }
  return dayjs().weekday(6).toDate()
}
