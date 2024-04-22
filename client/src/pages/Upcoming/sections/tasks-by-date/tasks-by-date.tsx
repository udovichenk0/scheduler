import { useUnit } from "effector-react"
import { RefObject, useContext, useEffect } from "react"
import { Dayjs } from "dayjs"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem, Task } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"

import {
  $$dateModal,
  $$idModal,
  TaskManagerContext,
} from "../../upcoming.model"

export const TasksByDate = ({
  taskRef,
  onSelectTaskId,
  selectedTaskId,
  tasks,
  date,
}: {
  taskRef: RefObject<HTMLDivElement>
  onSelectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  tasks: Task[]
  date: Dayjs
}) => {
  const { $$taskDisclosure, $$updateTask, $$createTask } =
    useContext(TaskManagerContext)

  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)

  const onUpdateTaskFormOpen = useUnit($$taskDisclosure.updatedTaskOpened)
  const onChangeUpdateDate = useUnit($$updateTask.dateChanged)
  const onChangeCreateDate = useUnit($$createTask.dateChanged)
  const onChangeStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onChangeDate = useUnit($$updateTask.dateChangedAndUpdated)

  useEffect(() => {
    onChangeUpdateDate(date.toDate())
    onChangeCreateDate(date.toDate())
  }, [date])
  return (
    <section className="h-full pt-2">
      {tasks?.map((task, id) => {
        return (
          <div className="px-3 pb-2" key={id}>
            {task.id === updatedTaskId ? (
              <ExpandedTask
                dateModal={$$dateModal}
                modifyTaskModel={$$updateTask}
                taskRef={taskRef}
              />
            ) : (
              <TaskItem
                idModal={$$idModal}
                onUpdateDate={onChangeDate}
                onUpdateStatus={onChangeStatus}
                isTaskSelected={selectedTaskId === task.id}
                onClick={() => onSelectTaskId(task.id)}
                onDoubleClick={() => onUpdateTaskFormOpen(task)}
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
            dateModal={$$dateModal}
            modifyTaskModel={$$createTask}
            dateModifier={true}
            taskRef={taskRef}
          />
        )}
      </div>
    </section>
  )
}
