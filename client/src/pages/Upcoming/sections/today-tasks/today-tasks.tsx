import { useUnit } from "effector-react"
import { RefObject, useEffect } from "react"
import { Dayjs } from "dayjs"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

import { Task } from "@/entities/task/tasks"

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
    updatedTask,
    updatedTaskOpened,
    changeUpdatedDate,
    changeCreatedDate,
  ] = useUnit([
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTask,
    $$taskDisclosure.updatedTaskOpened,
    $$updateTask.dateChanged,
    $$createTask.dateChanged,
  ])
  useEffect(() => {
    changeUpdatedDate(date.toDate())
    changeCreatedDate(date.toDate())
  }, [date])
  return (
    <section className="h-full">
      <List
        $$updateTask={$$updateTask}
        updatedTaskId={updatedTask?.id || null}
        tasks={tasks}
        openTask={updatedTaskOpened}
        taskRef={taskRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
        typeLabel
      />
      <NoTasks isTaskListEmpty={!tasks?.length && !createdTask} />
      <div className="mx-5">
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
