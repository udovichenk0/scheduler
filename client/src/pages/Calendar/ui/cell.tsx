import dayjs from "dayjs"
import { useRef, useState, useEffect, MouseEvent } from "react"

import { Task } from "@/entities/task/task-item"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { TaskId } from "@/shared/api/task"

import { AllTasksModal } from "./all-tasks-modal"

type CellProps = {
  date: number
  month: number
  year: number
}
export const Cell = ({
  cell,
  tasks,
  updateTaskOpened,
  createTaskOpened,
}: {
  cell: CellProps
  tasks?: Task[]
  updateTaskOpened: (taskId: TaskId) => void
  createTaskOpened: (date: Date) => void
}) => {
  const taskContainerRef = useRef<HTMLDivElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)

  const [showMore, setShowMore] = useState(false)
  const [modalState, setModalState] = useState(false)

  const clickOnCell = (e: MouseEvent) => {
    if (taskContainerRef.current === e.target) {
      createTaskOpened(new Date(cell.year, cell.month, cell.date))
    }
  }

  const { date, month, year } = cell
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isFirstDate = cell.date === 1

  function shouldShowMore() {
    const taskHeight = 24
    const tasksLength =
      (taskContainerRef.current as HTMLDivElement)?.children.length * taskHeight
    const cellHeight = (taskContainerRef.current as HTMLDivElement)
      ?.clientHeight
    const shouldShowMore = tasksLength > cellHeight
    setShowMore(shouldShowMore)
  }

  // resize to detect if some tasks are hidden with overflow:hidden
  useEffect(() => {
    if (tasks?.length) {
      shouldShowMore()
      window.addEventListener("resize", shouldShowMore)
    }
    return () => {
      window.removeEventListener("resize", shouldShowMore)
    }
  }, [tasks?.length])

  return (
    <div
      ref={cellRef}
      onClick={clickOnCell}
      className={`w-full border-b ${
        isToday && "border-t border-t-accent"
      } border-r border-cBorder p-2 text-cCalendarFont`}
    >
      <div className="mb-1 flex items-center justify-end gap-1">
        {isFirstDate && (
          <span className="text-sm">{SHORT_MONTHS_NAMES[month]}</span>
        )}
        <div
          className={`${isPast && "opacity-30"} text-end ${
            isToday &&
            "flex h-6 w-6 items-center justify-center rounded-full bg-cFocus p-2"
          }`}
        >
          <span>{date}</span>
        </div>
      </div>
      <div
        ref={taskContainerRef}
        className="flex h-[calc(100%-3rem)] w-full flex-col flex-wrap gap-x-2 gap-y-1 overflow-x-clip"
      >
        {tasks?.map((task) => {
          return (
            <div
              onClick={() => updateTaskOpened(task.id)}
              key={task.id}
              className={`
              group relative w-full cursor-pointer
              rounded-[5px] bg-[#607d8b] px-1 text-start text-white`}
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
                className="absolute -top-12 left-1/2 z-[1000] hidden max-w-[150px] -translate-x-1/2 text-ellipsis rounded-[5px] bg-cCalendarTooltip px-3 py-1 after:absolute
                after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-full after:border-x-[7px] after:border-t-[7px] after:border-x-transparent after:border-t-cCalendarTooltip group-hover:block"
              >
                <div className="truncate text-primary">{task.title}</div>
              </div>

              <div className="truncate">{task.title}</div>
            </div>
          )
        })}
      </div>
      {showMore && (
        <button
          onClick={() => setModalState(true)}
          className="w-full text-start text-cIconDefault hover:text-primary"
        >
          show all
        </button>
      )}
      <AllTasksModal
        isOpen={modalState}
        onCloseModal={() => setModalState(false)}
        tasks={tasks}
        onTaskUpdate={updateTaskOpened}
      />
    </div>
  )
}
