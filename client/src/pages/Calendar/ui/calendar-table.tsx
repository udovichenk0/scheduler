import dayjs, { Dayjs } from "dayjs"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Task, TaskId, Status } from "@/entities/task"

import { generateCalendar } from "@/shared/lib/date/generate-calendar"
import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"
import { Grid } from "@/shared/ui/general/grid"

import { MonthSwitcher } from "./month-switcher"
import { Cell } from "./cell"

type CalendarProps = {
  tasks: Nullable<Record<string, Task[]>>
  onTaskClick: (e: HTMLButtonElement, task: Task) => void
  onCellClick: (e: HTMLButtonElement, date: Date) => void
  onShowMoreTasks: (tasks: Task[]) => void
  onUpdateStatus: ({ id, status }: { id: TaskId; status: Status }) => void
  setDate: (date: Dayjs) => void
  date: Dayjs
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
    const changeMonth = (date: Dayjs) => {
      setDate(date)
      setCalendar(generateCalendar(date.year(), date.month()))
    }
    return (
      <>
        <MonthSwitcher date={date} changeMonth={changeMonth} />
        <WeekNames />
        <Grid columns={7} rows={5} className="h-full">
          {calendar.map((cell) => {
            const date = dayjs(
              new Date(cell.year, cell.month, cell.date),
            ).format("YYYY-MM-DD")
            const t = tasks?.[date] || []

            return (
              <Cell
                key={date}
                onTaskClick={onTaskClick}
                onClick={onCellClick}
                onUpdateStatus={onUpdateStatus}
                onShowMoreTasks={onShowMoreTasks}
                cell={cell}
                tasks={t}
              />
            )
          })}
        </Grid>
      </>
    )
  },
)

export const WeekNames = () => {
  const { t } = useTranslation()
  return (
    <div className="flex justify-around border-y border-r border-cBorder font-bold text-primary">
      {SHORT_WEEKS_NAMES.map((week) => {
        return <span key={week}>{t(week)}</span>
      })}
    </div>
  )
}
