import { Dayjs } from "dayjs"

export type BaseWord = 'day' | 'week' | 'month' | 'month'

export type Time = {
  hour: number
  minute: number
}

export type Hint = {
  date: Dayjs
  hint: string
}
