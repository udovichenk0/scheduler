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

type CalendarProps = {
  tasks: Record<string, Task[]>
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
    const changeMonth = (month: number) => {
      setDate(dayjs().month(month))
      setCalendar(generateCalendar(month))
    }
    return (
      <>
        <MonthSwitcher
          displayedMonth={date.month()}
          changeMonth={changeMonth}
        />
        <WeekNames />
        <div className="grid h-full auto-rows-[minmax(140px,_1fr)]">
          {calendar.map((row, rowId) => {
            return (
              <div
                className="grid auto-rows-[minmax(140px,_1fr)] grid-cols-7 border-cBorder text-primary first:border-t"
                key={rowId}
              >
                {row.map((cell) => {
                  const date = dayjs(
                    new Date(cell.year, cell.month, cell.date),
                  ).format("YYYY-MM-DD")
                  const t = tasks[date]
                  const key = `${cell.date}/${cell.month}/${cell.year}`

                  return (
                    <Cell
                      key={key}
                      updateTaskOpened={openUpdatedTask}
                      createTaskOpened={openCreatedTask}
                      cell={cell}
                      tasks={t}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
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
