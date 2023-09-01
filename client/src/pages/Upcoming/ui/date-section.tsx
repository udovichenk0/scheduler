import { useUnit } from "effector-react"
import { RefObject, ReactNode } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

import { Task } from "@/entities/task/tasks"

import { Container } from "@/shared/ui/general/container"

import { $$updateTask, $$taskDisclosure, $$createTask } from "../upcoming.model"
export function TasksSection({
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
  selectTask: (task: Nullable<{ id: string }>) => void
  selectedTask: Nullable<{ id: string }>
}) {
  const [taskId, updateTaskOpened, createdTask] = useUnit([
    $$taskDisclosure.$updatedTask,
    $$taskDisclosure.updatedTaskOpened,
    $$taskDisclosure.$createdTask,
  ])
  return (
    <div className="select-none border-t-[1px] border-cBorder text-primary">
      <Container>
        <div className="pl-7">
          <button
            disabled={isNextSelectedTask}
            onClick={action}
            className={`${
              isNextSelectedTask && "cursor-pointer bg-cFocus"
            } flex w-full items-center gap-2 rounded-[5px] px-3 text-lg enabled:hover:bg-cHover`}
          >
            {title}
          </button>
        </div>
      </Container>
      <List
        className="border-t-[1px] border-cBorder"
        $$updateTask={$$updateTask}
        updatedTaskId={taskId?.id || null}
        tasks={tasks}
        openTask={updateTaskOpened}
        taskRef={taskRef}
        selectedTask={selectedTask}
        dateLabel
        typeLabel
        selectTask={selectTask}
      />
      <div className="px-5">
        {createdTask && isSelected && (
          <ExpandedTask
            dateModifier={true}
            modifyTaskModel={$$createTask}
            taskRef={taskRef}
          />
        )}
      </div>
    </div>
  )
}
