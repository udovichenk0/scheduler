import dayjs from "dayjs"
import { useRef, useState, useEffect, KeyboardEvent } from "react"

import { Task, TaskId, TaskStatus, TaskStatuses } from "@/entities/task"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"

import { CellHeader } from "./cell-header"
import { isEnter } from "@/shared/lib/key-utils"
import { useUnit } from "effector-react"
import { $$createTask } from "../calendar.model"
import { useTranslation } from "react-i18next"

export type CellProps = {
  date: number
  month: number
  year: number
}
export const Cell = ({
  cell,
  tasks,
  onTaskClick,
  onShowMoreTasks,
  onClick,
  onUpdateStatus,
}: {
  cell: CellProps
  tasks?: Task[]
  onTaskClick: (target: HTMLButtonElement, task: Task) => void
  onShowMoreTasks: (tasks: Task[]) => void,
  onClick: (target: HTMLButtonElement, date: Date) => void
  onUpdateStatus: ({ id, status }: { id: TaskId; status: TaskStatus }) => void
}) => {
  const taskContainerRef = useRef<HTMLDivElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(false)

  const { date, month, year } = cell
  
  const setDate = useUnit($$createTask.setDate)

  const cellDate = new Date(year, month, date)
  const clickOnCell = () => {
    const target = cellRef.current as unknown as HTMLButtonElement
    onClick(target, cellDate)
    setDate(cellDate)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if(isEnter(e)){
      clickOnCell()
    }
  }

  const isToday = dayjs(cellDate).isSame(dayjs(), "date")

  function shouldShowMore() {
    const taskContainer = taskContainerRef.current as HTMLDivElement
    const tasksAmount = taskContainer?.children.length

    const TASK_HEIGHT = 24

    //                  sum of the tasks          + gaps between them
    const tasksHeight = tasksAmount * TASK_HEIGHT + (tasksAmount - 1) * 4

    const cellHeight = taskContainer?.clientHeight
    setShowMore(tasksHeight >= cellHeight)
  }

  // resize to detect if some tasks are hidden with overflow:hidden
  useEffect(() => {
    if (tasks?.length) {
      shouldShowMore()
      window.addEventListener("resize", shouldShowMore)
    }
    return () => {
      document.removeEventListener("resize", shouldShowMore)
    }
  }, [tasks?.length])

  return (
    <div
      ref={cellRef}
      onClick={clickOnCell}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`w-full flex flex-col min-h-[100px] focus-visible:ring border-b overflow-x-clip ${
        isToday && "border-t border-t-accent"
      } border-r border-cBorder p-2 text-cCalendarFont`}
    >
      <CellHeader cell={cell} />
      <div
        ref={taskContainerRef}
        className="flex h-[calc(100%-3rem)] w-full flex-col flex-wrap gap-x-2 gap-y-1"
      >
        {tasks?.map((task) => {
          const { id, status, title } = task
          return (
            <div key={id} className="relative w-full group">
              <Checkbox
                iconClassName="fill-white"
                className="left-[2px] top-[2px] absolute bg-[#607d8b] hidden group-hover:flex"
                borderClassName="border-white"
                onChange={() => onUpdateStatus({ id, status })}
                checked={status == TaskStatuses.FINISHED}
              />
              <button
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskClick(e.target as HTMLButtonElement, task)
                }}
                className="select-none w-full truncate cursor-pointer focus-visible:ring rounded-[5px] bg-[#607d8b] text-start text-white px-1"
              >
                {title}
              </button>
            </div>
          )
        })}
      </div>
      {showMore && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onShowMoreTasks(tasks || [])
          }}
          className="w-full text-start text-sm text-cIconDefault hover:text-primary"
        >
          {t("calendar.showAll")}
        </button>
      )}
    </div>
  )
}
