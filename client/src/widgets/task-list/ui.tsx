import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { RefObject } from "react"

import { UpdateTaskType } from "@/features/task/update"

import { Task, TaskItem } from "@/entities/task/tasks"

import { ExpandedTask } from "../expanded-task"

type ListProps = {
  $$updateTask: UpdateTaskType
  className?: string
  tasks: Task[]
  updatedTaskId: Nullable<string>
  openTask: (task: Task) => void
  taskRef: RefObject<HTMLDivElement>
  dateModifier?: boolean
  dateLabel?: boolean
  selectedTask: Nullable<{ id: string }>
  selectTask: (task: Nullable<{ id: string }>) => void
  typeLabel?: boolean
}
export const List = ({
  tasks,
  updatedTaskId,
  className,
  openTask,
  $$updateTask,
  taskRef,
  dateModifier = true,
  dateLabel = false,
  selectedTask,
  selectTask,
  typeLabel = false,
}: ListProps) => {
  const [changeStatusAndUpdate, changeDateAndUpdate] = useUnit([
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  return (
    <>
      {!!tasks?.length && (
        <div className={clsx("px-3", className)}>
          {tasks.map((task, id) => {
            return (
              <div className="first:pt-2 last:pb-2" key={id}>
                {task.id === updatedTaskId ? (
                  <ExpandedTask
                    dateModifier={dateModifier}
                    modifyTaskModel={$$updateTask}
                    taskRef={taskRef}
                  />
                ) : (
                  <TaskItem
                    onUpdateDate={changeDateAndUpdate}
                    onUpdateStatus={changeStatusAndUpdate}
                    isTaskSelected={selectedTask?.id === task.id}
                    onClick={selectTask}
                    typeLabel={typeLabel}
                    dateLabel={dateLabel}
                    onDoubleClick={() => openTask(task)}
                    task={task}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
