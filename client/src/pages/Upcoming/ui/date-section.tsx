import { useUnit } from "effector-react"
import { RefObject, ReactNode } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

import { ModifyTaskForm } from "@/entities/task/modify"
import { Task } from "@/entities/task/tasks"

import { $$updateTask, $$taskAccordion, $$createTask } from "../upcoming.model"
export function TasksSection({
  outRef,
  tasks,
  title,
  isSelected,
  action,
  selectTask,
  selectedTask,
}: {
  outRef: RefObject<HTMLDivElement>
  tasks: Task[]
  title: ReactNode
  isSelected: boolean
  action: () => void
  selectTask: (task: Nullable<{ id: number }>) => void
  selectedTask: Nullable<{ id: number }>
}) {
  const [taskId, updateTaskOpened, newTask] = useUnit([
    $$taskAccordion.$taskId,
    $$taskAccordion.updateTaskOpened,
    $$taskAccordion.$newTask,
  ])
  return (
    <div className="select-none border-t-[1px] border-cBorder text-primary">
      <div className="mx-2">
        <button
          disabled={isSelected}
          onClick={action}
          className={`${
            isSelected && "cursor-pointer bg-cFocus"
          } my-2 flex w-full items-center gap-2 rounded-[5px] px-3 text-lg enabled:hover:bg-cHover`}
        >
          {title}
        </button>
      </div>
      <List
        className="border-t-[1px] border-cBorder"
        $$updateTask={$$updateTask}
        taskId={taskId}
        tasks={tasks}
        openTask={updateTaskOpened}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
        dateModifier
      />
      <div className="px-4">
        {newTask && isSelected && (
          <ExpandedTask taskRef={outRef}>
            <ModifyTaskForm date modifyTaskModel={$$createTask} />
          </ExpandedTask>
        )}
      </div>
    </div>
  )
}
