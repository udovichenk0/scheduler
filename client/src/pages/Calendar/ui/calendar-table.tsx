import dayjs from "dayjs"

import { Task } from "@/entities/task/tasks"

import { months } from "@/shared/config/constants"

type CalendarProps = {
  calendar: {
    date: number
    month: number
    year: number
  }[][]
  tasks: Record<string, Task[]>
}

export const CalendarTable = ({ calendar, tasks }: CalendarProps) => {
  return (
    <>
      {calendar.map((row, rowId) => {
        return (
          <div
            className="flex justify-around border-cBorder text-primary first:border-t"
            key={rowId}
          >
            {row.map((cell) => {
              const date = dayjs(
                new Date(cell.year, cell.month, cell.date),
              ).format("YYYY-MM-DD")
              const t = tasks[date]
              const key = `${cell.date}/${cell.month}/${cell.year}`

              return <Cell cell={cell} tasks={t} key={key} />
            })}
          </div>
        )
      })}
    </>
  )
}
type CellProps = {
  date: number
  month: number
  year: number
}
const Cell = ({ cell, tasks }: { cell: CellProps; tasks?: Task[] }) => {
  const { date, month, year } = cell
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")

  const isManyTasks = tasks && tasks?.length > 4
  const t = isManyTasks ? tasks?.slice(0, 3) : tasks
  const isFirstDate = cell.date === 1
  return (
    <div
      className={`h-40 w-full border-b border-r border-cBorder p-2 text-cCalendarFont first:border-l ${
        !isPast ? "border-cHOver" : "text-cSecondBorder"
      }`}
    >
      <div
        className={`relative mb-1 text-end ${
          isToday &&
          'after:absolute after:-right-[6px] after:-top-[3px] after:z-0 after:h-7 after:w-7 after:rounded-full after:bg-cHover after:content-[""]'
        }`}
      >
        {isFirstDate && <span className="pr-2">{months[month]}</span>}
        <span className="relative z-[1]">{date}</span>
      </div>
      <div className="mb-1 flex flex-col gap-y-1">
        {t?.map((task) => {
          return (
            <button
              key={task.id}
              className={`rounded-[5px] px-1 text-start ${
                isPast ? "bg-cTimeIntervalLow" : "bg-cTimeInterval"
              }`}
            >
              {task.title}
            </button>
          )
        })}
      </div>
      {isManyTasks && (
        <button className="w-full px-1 text-start">
          + {tasks.length - t!.length} more
        </button>
      )}
    </div>
  )
}
