import { useState } from "react"
import dayjs from "dayjs"
import { useUnit } from "effector-react"

import { Layout } from "@/templates/main"

import { generateCalendar } from "@/shared/lib/generate-calendar"

import { $mappedTasks } from "./calendar.model"
import { MonthSwitcher } from "./ui/month-switcher"
import { WeekNames } from "./ui/week-names"
import { CalendarTable } from "./ui/calendar-table"

export const Calendar = () => {
  const [calendar, setCalendar] = useState(generateCalendar())
  const [displayedMonth, setDisplayedMonth] = useState(dayjs().month())
  const changeMonth = (month: number) => {
    setDisplayedMonth(month)
    setCalendar(generateCalendar(month))
  }
  const [tasks] = useUnit([$mappedTasks])
  return (
    <Layout>
      <Layout.Header iconName="common/calendar" title="Calendar" />
      <Layout.Content className="px-5">
        <MonthSwitcher
          displayedMonth={displayedMonth}
          changeMonth={changeMonth}
        />
        <WeekNames />
        <CalendarTable calendar={calendar} tasks={tasks} />
      </Layout.Content>
    </Layout>
  )
}
