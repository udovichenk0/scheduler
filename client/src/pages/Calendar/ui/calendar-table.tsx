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
    <div className="grow grid">
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
    </div>
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

  const isFirstDate = cell.date === 1
  return (
    <div
      className={`w-full border-b border-r border-cBorder p-2 text-cCalendarFont`}
    >
      <div
        className={`relative ${isPast && 'opacity-30'} mb-1 text-end ${
          isToday &&
          'after:absolute after:-right-[6px] after:-top-[3px] after:z-0 after:h-7 after:w-7 after:rounded-full after:bg-cHover after:content-[""]'
        }`}
      >
        {isFirstDate && <span className="pr-2">{months[month]}</span>}
        <span className="relative z-[1]">{date}</span>
      </div>
      <div className="flex flex-col gap-y-1">
        {tasks?.map((task) => {
          return (
            <button
              key={task.id}
              className={`
              group relative
              rounded-[5px] px-1 text-white text-start bg-[#607d8b]`}
            >
              <span className="absolute hidden -top-12 left-1/2 -translate-x-1/2 group-hover:block bg-cCalendarTooltip px-3 py-1 rounded-[5px]
              after:left-1/2 after:bottom-0 after:translate-y-full after:-translate-x-1/2 after:absolute after:border-x-[7px] after:border-x-transparent after:border-t-[7px] after:border-t-cCalendarTooltip">{task.title}</span>
              {task.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}
