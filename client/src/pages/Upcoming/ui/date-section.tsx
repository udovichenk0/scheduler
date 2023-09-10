import { useUnit } from "effector-react"
import { RefObject, ReactNode } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"

import { Task, TaskItem } from "@/entities/task/task-item"

import { $$updateTask, $$taskDisclosure, $$createTask } from "../upcoming.model"
export const TasksSection = ({
  taskRef,
  tasks,
  title,
  isSelected,
  isNextSelectedTask,
  action,
  selectTask,
  selectedTask,
}: {
  taskRef: RefObject<HTMLDivElement>
  tasks: Task[]
  title: ReactNode
  isSelected: boolean
  isNextSelectedTask?: boolean
  action: () => void
  selectTask: (taskId: Nullable<{ id: string }>) => void
  selectedTask: Nullable<{ id: string }>
}) => {
  const [
    updatedTaskId,
    openUpdatedTaskById,
    createdTask,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $$taskDisclosure.$updatedTaskId,
    $$taskDisclosure.updatedTaskOpenedById,
    $$taskDisclosure.$createdTask,
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  return (
    <div className="select-none border-cBorder text-primary">
      <div className="border-b border-cBorder p-2 px-3 pl-9">
        <button
          disabled={isNextSelectedTask}
          onClick={action}
          className={`${
            isNextSelectedTask && "cursor-pointer bg-cFocus"
          } flex w-full items-center gap-2 rounded-[5px] px-3 text-lg enabled:hover:bg-cHover `}
        >
          {title}
        </button>
      </div>
      <div>
        {tasks?.map((task, id) => {
          return (
            <div
              className="border-cBorder px-3 pb-1 first:pt-2 last:border-b last:pb-2"
              key={id}
            >
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
                  isTaskSelected={selectedTask?.id === task.id}
                  onClick={selectTask}
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
