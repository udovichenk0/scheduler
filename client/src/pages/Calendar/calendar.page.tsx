import { useState } from "react"
import dayjs from "dayjs"
import { useUnit } from "effector-react"

import { Layout } from "@/templates/main"

import { generateCalendar } from "@/shared/lib/generate-calendar"

import { $mappedTasks } from "./calendar.model"
import { MonthSwitcher } from "./ui/month-switcher"
import { WeekNames } from "./ui/week-names"
import { CalendarTable } from "./ui/calendar-table"
const fullNameMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const Calendar = () => {
  const [calendar, setCalendar] = useState(generateCalendar())
  const [date, setDate] = useState(dayjs())
  const changeMonth = (month: number) => {
    setDate(dayjs().month(month))
    setCalendar(generateCalendar(month))
  }
  const [tasks] = useUnit([$mappedTasks])
  const displayedMonth = date.month()
  const displayedYear = date.year()
  return (
    <Layout>
      <Layout.Header iconName="common/calendar" title={`Calendar, ${fullNameMonths[displayedMonth]} ${displayedYear}`} />
      <Layout.Content className="">
        <div className="h-full flex flex-col">
        <MonthSwitcher
          displayedMonth={date.month()}
          changeMonth={changeMonth}
        />
        <WeekNames />
        <CalendarTable calendar={calendar} tasks={tasks} />

        </div>
      </Layout.Content>
    </Layout>
  )
}