import dayjs from "dayjs"
import { memo } from "react"

import { Task } from "@/entities/task/tasks"

import { Cell } from "./cell"

type CalendarProps = {
  calendar: {
    date: number
    month: number
    year: number
  }[][]
  tasks: Record<string, Task[]>
  updateTaskOpened: (task: Task) => void
  createTaskOpened: (date: Date) => void
}
export const CalendarTable = memo(
  ({ calendar, tasks, updateTaskOpened, createTaskOpened }: CalendarProps) => {
    return (
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
                    updateTaskOpened={updateTaskOpened}
                    createTaskOpened={createTaskOpened}
                    cell={cell}
                    tasks={t}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    )
  },
)
