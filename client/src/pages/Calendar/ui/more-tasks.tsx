import { useUnit } from "effector-react"
import { Store } from "effector"

import { Status, Task, TaskId } from "@/entities/task/type"
import { TaskStatuses } from "@/entities/task/config"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"

export const MoreTasks = ({
  $tasks,
  onUpdateStatus,
  onTaskClick,
}: {
  $tasks: Store<Task[]>
  onTaskClick: (target: HTMLButtonElement, task: Task) => void
  onUpdateStatus: (data: { id: TaskId; status: Status }) => void
}) => {
  const tasks = useUnit($tasks)
  return (
    <>
      {tasks?.map((task) => {
        const { id, status } = task
        return (
          <div key={task.id} className="flex w-full items-center gap-x-2">
            <Checkbox
              iconClassName="fill-white"
              className="left-[2px] top-[2px]"
              borderClassName="border-white"
              onChange={() => onUpdateStatus({ id, status })}
              checked={task.status == TaskStatuses.FINISHED}
            />
            <button
              onClick={(e) => onTaskClick(e.target as HTMLButtonElement, task)}
              className="w-full cursor-pointer select-none truncate rounded-[5px] bg-[#607d8b] px-1 text-start text-white focus-visible:ring"
            >
              {task.title}
            </button>
          </div>
        )
      })}
    </>
  )
}
