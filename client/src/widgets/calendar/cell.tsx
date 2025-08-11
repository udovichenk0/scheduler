import { Fragment } from "react/jsx-runtime"
import { useState } from "react"

import { TaskRemover } from "@/features/manage-task/interface"

import { Task } from "@/entities/task/type"
import { TaskContextMenu } from "@/entities/task/ui/context-menu"

import { SDate } from "@/shared/lib/date/lib"
import { Button } from "@/shared/ui/buttons/main-button"

import { Cell as CellType } from "./type"
import { ITEM_HEIGHT, MAX_TASKS_PER_CELL, MIN_HEIGHT } from "./config"

type CellProps = {
  cell?: CellType
  date: SDate
  $$taskRemover: TaskRemover
  onUpdate: (task: Task) => void
  onCreate: () => void
}

export const Cell = ({
  cell,
  date,
  $$taskRemover,
  onUpdate,
  onCreate,
}: CellProps) => {
  const [more, setMore] = useState(false)
  const tasks = more ? cell?.tasks : cell?.tasks.slice(0, MAX_TASKS_PER_CELL)
  return (
    <div
      key={date.toUnix()}
      style={{ minHeight: MIN_HEIGHT }}
      className="border-b-cBorder border-r-cBorder group flex w-full flex-col border-b border-r"
    >
      <div className="-mr-[1px] flex-1">
        <div className="flex flex-1 flex-col gap-1 py-2">
          <Stubs count={cell?.stub || 0} />
          {tasks &&
            tasks.map(({ task, range }) => {
              return (
                <Fragment key={task.id}>
                  <div
                    style={{
                      width: `${range * 100}%`,
                      height: `${ITEM_HEIGHT}px`,
                    }}
                  >
                    <TaskContextMenu
                      taskId={task.id}
                      $$taskRemover={$$taskRemover}
                    >
                      <div
                        style={{ height: ITEM_HEIGHT }}
                        tabIndex={0}
                        onClick={() => onUpdate(task)}
                        className="bg-main-inverse z-5 relative mx-2 flex h-full cursor-pointer items-center px-2 text-sm text-white"
                      >
                        {task.title}
                      </div>
                    </TaskContextMenu>
                  </div>
                </Fragment>
              )
            })}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 py-2 text-sm">
        <div>
          {cell && cell.tasks.length > MAX_TASKS_PER_CELL && (
            <Button
              size="xs"
              className="py-0.5! px-2"
              onClick={() => setMore(() => !more)}
              intent="filled"
            >
              {more
                ? "Less"
                : `More +${cell.tasks.length - MAX_TASKS_PER_CELL}`}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-x-1">
          <Button
            onClick={onCreate}
            intent="filled"
            className="hidden aspect-square w-5 rounded-none group-hover:inline"
          >
            +
          </Button>
          <div className="text-cFont">{date.date}</div>
        </div>
      </div>
    </div>
  )
}

function Stubs({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, i) => {
    return <div key={i} style={{ height: `${ITEM_HEIGHT}px` }}></div>
  })
}
