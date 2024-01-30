import dayjs, { Dayjs } from "dayjs"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Task } from "@/entities/task/task-item"

import { generateCalendar } from "@/shared/lib/date/generate-calendar"
import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"
import { ModalType } from "@/shared/lib/modal"
import { TaskId } from "@/shared/api/task"

import { MonthSwitcher } from "./month-switcher"
import { Cell } from "./cell"
import { Grid } from "@/shared/ui/general/grid"

type CalendarProps = {
  tasks: Nullable<Record<string, Task[]>>
  openUpdatedTask: (taskId: TaskId) => void
  openCreatedTask: (date: Date) => void
  setDate: (date: Dayjs) => void
  date: Dayjs
  modal: ModalType
}
export const Calendar = memo(
  ({
    tasks,
    openUpdatedTask,
    openCreatedTask,
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
        <MonthSwitcher
          date={date}
          changeMonth={changeMonth}
        />
        <WeekNames />
        <Grid columns={7} rows={5} className="h-full">
          {calendar.map(( cell ) => {
              const date = dayjs(
                new Date(cell.year, cell.month, cell.date),
              ).format("YYYY-MM-DD")
              const t = tasks?.[date]

              return (
                <Cell
                  key={date}
                  updateTaskOpened={openUpdatedTask}
                  createTaskOpened={openCreatedTask}
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
