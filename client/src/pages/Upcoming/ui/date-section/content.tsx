import { useUnit } from "effector-react"
import { RefObject, ReactNode, useContext } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"

import { Task, TaskItem } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

import { TaskManagerContext } from "../../upcoming.model"

export const Content = ({
  onSelectTaskId,
  taskRef,
  section,
  tasks,
  isSelected,
  selectedTaskId,
}: {
  onSelectTaskId: (args: {taskId: TaskId, section: string}) => void
  taskRef: RefObject<HTMLDivElement>
  section: string,
  tasks: Task[]
  title?: ReactNode
  isSelected: boolean
  selectedTaskId: Nullable<TaskId>
}) => {
  const { $$createTask, $$updateTask, $$taskDisclosure } =
    useContext(TaskManagerContext)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)

  return (
    <div className="select-none border-cBorder text-primary">
      <div className="pt-2">
        {tasks?.map((task, id) => {
          return (
            <div className="border-cBorder px-3 pb-2 last:border-b" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  typeLabel
                  dateLabel
                  onUpdateDate={changeDateAndUpdate}
                  onUpdateStatus={changeStatusAndUpdate}
                  isTaskSelected={selectedTaskId === task.id}
                  onClick={() => onSelectTaskId({ taskId: task.id, section })}
                  onDoubleClick={() => openUpdatedTaskById(task.id)}
                  task={task}
                />
              )}
            </div>
          )
        })}
      </div>
      {createdTask && isSelected && (
        <div className="border-b border-cBorder px-3 py-2">
          <ExpandedTask
            dateModifier={true}
            modifyTaskModel={$$createTask}
            taskRef={taskRef}
          />
        </div>
      )}
    </div>
  )
}
