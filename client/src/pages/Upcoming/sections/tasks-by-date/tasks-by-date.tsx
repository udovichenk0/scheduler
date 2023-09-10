import { useUnit } from "effector-react"
import { RefObject, useEffect } from "react"
import { Dayjs } from "dayjs"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem, Task } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"

import {
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
} from "../../upcoming.model"

export const TasksByDate = ({
  taskRef,
  selectTask,
  selectedTask,
  tasks,
  date,
}: {
  taskRef: RefObject<HTMLDivElement>
  selectTask: (task: Nullable<{ id: string }>) => void
  selectedTask: Nullable<{ id: string }>
  tasks: Task[]
  date: Dayjs
}) => {
  const [
    createdTask,
    updatedTaskId,
    openUpdatedTaskById,
    changeUpdatedDate,
    changeCreatedDate,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTaskId,
    $$taskDisclosure.updatedTaskOpenedById,
    $$updateTask.dateChanged,
    $$createTask.dateChanged,
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  useEffect(() => {
    changeUpdatedDate(date.toDate())
    changeCreatedDate(date.toDate())
  }, [date])
  return (
    <section className="h-full">
      {tasks?.map((task, id) => {
        return (
          <div className="mb-1 px-3 first:pt-2 last:pb-2" key={id}>
            {task.id === updatedTaskId ? (
              <ExpandedTask modifyTaskModel={$$updateTask} taskRef={taskRef} />
            ) : (
              <TaskItem
                onUpdateDate={changeDateAndUpdate}
                onUpdateStatus={changeStatusAndUpdate}
                isTaskSelected={selectedTask?.id === task.id}
                onClick={selectTask}
                onDoubleClick={() => openUpdatedTaskById(task.id)}
                task={task}
              />
            )}
          </div>
        )
      })}
      <NoTasks isTaskListEmpty={!tasks?.length && !createdTask} />
      <div className="mx-3">
        {createdTask && (
          <ExpandedTask
            modifyTaskModel={$$createTask}
            dateModifier={true}
            taskRef={taskRef}
          />
        )}
      </div>
    </section>
  )
}
