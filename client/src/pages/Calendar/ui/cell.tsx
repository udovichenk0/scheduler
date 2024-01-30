import dayjs from "dayjs"
import { useRef, useState, useEffect, MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { Task } from "@/entities/task/task-item"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { TaskId } from "@/shared/api/task"

import { AllTasksModal } from "./all-tasks-modal"
import { Tooltip } from "@/shared/ui/general/tooltip"

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
          return (
            <Tooltip
              text={task.title}
              onClick={() => updateTaskOpened(task.id)}
              key={task.id}
              className={`
              w-full cursor-pointer flex items-center rounded-[5px] bg-[#607d8b] px-1 text-start text-white`}>
              <Checkbox
                iconClassName="fill-white"
                className="absolute left-[2px] top-[2px]"
                borderClassName="border-white bg-[#607d8b] hidden group-hover:flex"
                onChange={() => console.log(1)}
                checked
              />
              <span className="truncate">{task.title}</span>
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

const CellHeader = ({ cell }: { cell: CellProps}) => {
  const { t } = useTranslation()
  const { date, month, year } = cell
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isFirstDate = cell.date === 1

  return (
    <div className="mb-1 flex items-center justify-end gap-1">
      {isFirstDate && (
        <span className="text-sm">{t(SHORT_MONTHS_NAMES[month])}</span>
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
  )
}

const CellFooter = ({ 
  updateTaskOpened,
  showMoreVisible,
  tasks
}: { 
  updateTaskOpened: (taskId: TaskId) => void
  showMoreVisible: boolean,
  tasks?: Task[]
}) => {
  const { t } = useTranslation()

  const [modalState, setModalState] = useState(false)
  return (
    <div className="h-5">
      {showMoreVisible && (
        <button
          onClick={() => setModalState(true)}
          className="w-full text-start text-sm text-cIconDefault hover:text-primary"
        >
          {t("calendar.showAll")}
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
