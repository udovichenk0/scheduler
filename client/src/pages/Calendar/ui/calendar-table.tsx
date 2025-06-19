import { memo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Status, Task, TaskId } from "@/entities/task/type"

import { generateCalendar } from "@/shared/lib/date/generate-calendar"
import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"
import { Grid } from "@/shared/ui/general/grid"
import { SDate } from "@/shared/lib/date/lib"

import { MonthSwitcher } from "./month-switcher"
import { Cell } from "./cell"

type CalendarProps = {
  tasks: Nullable<Record<string, Task[]>>
  onTaskClick: (e: HTMLButtonElement, task: Task) => void
  onCellClick: (e: HTMLButtonElement, date: SDate) => void
  onShowMoreTasks: (tasks: Task[]) => void
  onUpdateStatus: ({ id, status }: { id: TaskId; status: Status }) => void
  setDate: (date: SDate) => void
  date: SDate
}
export const Calendar = memo(
  ({
    tasks,
    onTaskClick,
    onCellClick,
    onUpdateStatus,
    onShowMoreTasks,
    setDate,
    date,
  }: CalendarProps) => {
    const [calendar, setCalendar] = useState(generateCalendar)
    const changeMonth = (date: SDate) => {
      setDate(date)
      setCalendar(generateCalendar(date.year, date.month))
    }
    return (
      <>
        <MonthSwitcher date={date} changeMonth={changeMonth} />
        <WeekNames />
        <Grid columns={7} rows={5} className="h-full">
          {calendar.map((date) => {
            const formattedDate = date.format("YYYY-MM-DD")
            const t = tasks?.[formattedDate] || []

            return (
              <Cell
                key={formattedDate}
                onTaskClick={onTaskClick}
                onClick={onCellClick}
                onUpdateStatus={onUpdateStatus}
                onShowMoreTasks={onShowMoreTasks}
                date={date}
                tasks={t}
              />
            )
          })}
        </Grid>
      </>
    )
  },
)

const WeekNames = () => {
  const { t } = useTranslation()
  return (
    <div className="border-cBorder text-primary flex justify-around border-y border-r font-bold">
      {SHORT_WEEKS_NAMES.map((week) => {
        return <span key={week}>{t(week)}</span>
      })}
    </div>
  )
}
