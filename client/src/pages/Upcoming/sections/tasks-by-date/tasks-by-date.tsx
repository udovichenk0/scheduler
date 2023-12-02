import { useUnit } from "effector-react"
import { RefObject, useContext, useEffect } from "react"
import { Dayjs } from "dayjs"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem, Task } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"

import { TaskManagerContext } from "../../upcoming.model"

export const TasksByDate = ({
  taskRef,
  selectTaskId,
  selectedTaskId,
  tasks,
  date,
}: {
  taskRef: RefObject<HTMLDivElement>
  selectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  tasks: Task[]
  date: Dayjs
}) => {
  const { $$taskDisclosure, $$updateTask, $$createTask } =
    useContext(TaskManagerContext)

  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const changeUpdatedDate = useUnit($$updateTask.dateChanged)
  const changeCreatedDate = useUnit($$createTask.dateChanged)
  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)

  useEffect(() => {
    changeUpdatedDate(date.toDate())
    changeCreatedDate(date.toDate())
  }, [date])
  return (
    <section className="h-full pt-2">
      {tasks?.map((task, id) => {
        return (
          <div className="px-3 pb-2" key={id}>
            {task.id === updatedTaskId ? (
              <ExpandedTask modifyTaskModel={$$updateTask} taskRef={taskRef} />
            ) : (
              <TaskItem
                onUpdateDate={changeDateAndUpdate}
                onUpdateStatus={changeStatusAndUpdate}
                isTaskSelected={selectedTaskId === task.id}
                onClick={() => selectTaskId(task.id)}
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
