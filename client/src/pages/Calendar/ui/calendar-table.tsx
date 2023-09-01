import dayjs from "dayjs"
import { useRef, MouseEvent, memo } from "react"

import { Task } from "@/entities/task/tasks"

import { months } from "@/shared/config/constants"
import { Checkbox } from "@/shared/ui/data-entry/checkbox"

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
      <div className="grid grow">
        {calendar.map((row, rowId) => {
          return (
            <div
              className="grid grid-cols-7 border-cBorder text-primary first:border-t"
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
type CellProps = {
  date: number
  month: number
  year: number
}
const Cell = ({
  cell,
  tasks,
  updateTaskOpened,
  createTaskOpened,
}: {
  cell: CellProps
  tasks?: Task[]
  updateTaskOpened: (task: Task) => void
  createTaskOpened: (date: Date) => void
}) => {
  const ref = useRef(null)
  const clickOnCell = (e: MouseEvent) => {
    if (ref.current === e.target) {
      createTaskOpened(new Date(cell.year, cell.month, cell.date))
    }
  }
  const { date, month, year } = cell
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isFirstDate = cell.date === 1
  return (
    <div
      ref={ref}
      onClick={clickOnCell}
      className={`w-full border-b ${
        isToday && "border-t border-t-accent"
      } border-r border-cBorder p-2 text-cCalendarFont`}
    >
      <div className="mb-1 flex items-center justify-end gap-1 ">
        {isFirstDate && <span className="text-sm">{months[month]}</span>}
        <div
          className={`${isPast && "opacity-30"} text-end ${
            isToday &&
            "flex h-6 w-6 items-center justify-center rounded-full bg-cFocus p-2"
          }`}
        >
          <span>{date}</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        {tasks?.map((task) => {
          return (
            <div
              onClick={() => updateTaskOpened(task)}
              key={task.id}
              className={`
              group relative
              cursor-pointer rounded-[5px] bg-[#607d8b] px-1 text-start text-white`}
            >
              <span className="absolute left-[2px] top-[2px] hidden group-hover:block">
                <Checkbox
                  iconClassName="fill-white"
                  className="border-white bg-[#607d8b]"
                  onChange={() => console.log(1)}
                  checked
                />
              </span>
              <div
                className="absolute -top-12 left-1/2 hidden max-w-[150px] -translate-x-1/2 text-ellipsis rounded-[5px] bg-cCalendarTooltip px-3 py-1 after:absolute
                after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-full after:border-x-[7px] after:border-t-[7px] after:border-x-transparent after:border-t-cCalendarTooltip group-hover:block"
              >
                <div className="truncate text-primary">{task.title}</div>
              </div>

              <div className="truncate">{task.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
