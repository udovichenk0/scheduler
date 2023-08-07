import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { RefObject } from "react"

import { UpdateTaskType } from "@/features/task/update"

import { ModifyTaskForm } from "@/entities/task/modify"
import { Task, TaskItem } from "@/entities/task/tasks"

import { ExpandedTask } from "../expanded-task"

type ListProps = {
  $$updateTask: UpdateTaskType
  className?: string
  tasks: Task[]
  taskId: Nullable<string>
  openTask: (task: Task) => void
  taskRef: RefObject<HTMLDivElement>
  dateModifier?: boolean
  dateLabel?: boolean
  selectedTask: Nullable<{ id: string }>
  selectTask: (task: Nullable<{ id: string }>) => void
}
export const List = ({
  tasks,
  taskId,
  className,
  openTask,
  $$updateTask,
  taskRef,
  dateModifier = true,
  dateLabel = false,
  selectedTask,
  selectTask,
}: ListProps) => {
  const [toggleStatus] = useUnit([$$updateTask.changeStatusTriggered])
  return (
    <>
      {!!tasks?.length && (
        <div className={clsx("px-5", className)}>
          {tasks.map((task, id) => {
            return (
              <div className="first:pt-2 last:pb-2" key={id}>
                {task.id === taskId ? (
                  <ExpandedTask taskTitle={task.title} taskRef={taskRef}>
                    <ModifyTaskForm
                      date={dateModifier}
                      modifyTaskModel={$$updateTask}
                    />
                  </ExpandedTask>
                ) : (
                  <TaskItem
                    isTaskSelected={selectedTask?.id === task.id}
                    onClick={selectTask}
                    date={dateLabel}
                    onDoubleClick={() => openTask(task)}
                    onChangeCheckbox={() => toggleStatus(task.id)}
                    data={task}
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
