import { SDate } from "@/shared/lib/date/lib"

export type BaseWord = "day" | "week" | "month" | "year"

export type Time = {
  hour: number
  minute: number
}

export type Hint = {
  date: SDate
  hint: string
}
