import dayjs from "dayjs"
import { useRef, useState, useEffect, MouseEvent } from "react"

import { Task } from "@/entities/task/task-item"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { TaskId, TaskStatus } from "@/shared/api/task"

import { Tooltip } from "@/shared/ui/general/tooltip"
import { CellFooter } from "./cell-footer"
import { CellHeader } from "./cell-header"

export type CellProps = {
  date: number
  month: number
  year: number
}
export const Cell = ({
  cell,
  tasks,
  updateTaskOpened,
  createTaskOpened,
  onUpdateStatus,
}: {
  cell: CellProps
  tasks?: Task[]
  updateTaskOpened: (taskId: TaskId) => void
  createTaskOpened: (date: Date) => void
  onUpdateStatus: ({ id, status }:{ id: TaskId, status: TaskStatus}) => void
}) => {
  const taskContainerRef = useRef<HTMLDivElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)

  const [showMore, setShowMore] = useState(false)

  const { date, month, year } = cell
  const clickOnCell = (e: MouseEvent) => {
    if (taskContainerRef.current === e.target) {
      createTaskOpened(new Date(year, month, date))
    }
  }
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")

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
      window.addEventListener('resize', shouldShowMore)
    }
    return () => {
      document.removeEventListener("resize", shouldShowMore)
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
      <CellHeader cell={cell}/>
      <div
        ref={taskContainerRef}
        className="flex h-[calc(100%-3rem)] w-full flex-col flex-wrap gap-x-2 gap-y-1 overflow-x-clip"
      >
        {tasks?.map((task) => {
          const { id, status } = task
          return (
            <Tooltip text={task.title} size="md" key={task.id}>
                <div 
                  onClick={() => updateTaskOpened(task.id)}
                  className="bg-[#607d8b] rounded-[5px] text-start text-white px-1 flex items-center cursor-pointer">
                  <Checkbox
                    iconClassName="fill-white"
                      className="absolute left-[2px] top-[2px]"
                      borderClassName="border-white bg-[#607d8b] hidden group-hover:flex"
                      onChange={() => onUpdateStatus({id, status})}
                      checked={task.status == 'FINISHED'}
                    />
                    <span className="truncate">{task.title}</span>
                </div>
            </Tooltip>
          )
        })}
      </div>
      <CellFooter 
        updateTaskOpened={updateTaskOpened} 
        showMoreVisible={showMore} 
        tasks={tasks}/>
    </div>
  )
}