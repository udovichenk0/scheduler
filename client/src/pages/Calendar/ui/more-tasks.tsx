import { useUnit } from "effector-react"
import { Store } from "effector"

import { Task, TaskId, Status, TaskStatuses } from "@/entities/task"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"


export const MoreTasks = ({
  $tasks,
  onUpdateStatus,
  onTaskClick
}: {
  $tasks: Store<Task[]>
  onTaskClick: (target: HTMLButtonElement, task: Task) => void
  onUpdateStatus: (data: {id: TaskId, status: Status}) => void,
}) => {
  const tasks = useUnit($tasks)
  return (
    <>
      {tasks?.map((task) => {
        const { id, status } = task
        return (
          <div key={task.id} className="flex w-full gap-x-2 items-center">
            <Checkbox
              iconClassName="fill-white"
              className="left-[2px] top-[2px]"
              borderClassName="border-white"
              onChange={() => onUpdateStatus({ id, status })}
              checked={task.status == TaskStatuses.FINISHED}
            />
            <button
              onClick={(e) => onTaskClick(e.target as HTMLButtonElement, task)}
              className="w-full select-none truncate cursor-pointer focus-visible:ring rounded-[5px] bg-[#607d8b] text-start text-white px-1"
            >
              {task.title}
            </button>
          </div>
        )
      })}
    </>
  )
}
