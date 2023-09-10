import { createPortal } from "react-dom"

import { Task } from "@/entities/task/task-item"

export const AllTasksModal = ({
  isOpen,
  onCloseModal,
  tasks,
  onTaskUpdate,
}: {
  isOpen: boolean
  onCloseModal: () => void
  tasks?: Task[]
  onTaskUpdate: (task: Task) => void
}) => {
  if (!isOpen) return null
  return createPortal(
    <>
      <div
        onClick={onCloseModal}
        className="absolute left-0 top-0 z-50 h-screen w-full bg-black/40"
      />
      <div className="absolute left-1/2 top-1/2 z-50 flex max-h-[250px] w-[410px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[5px] bg-cTaskEdit py-3 text-sm">
        <div className="flex w-full flex-col gap-y-1 overflow-auto px-3">
          {tasks?.map((task) => {
            return (
              <div
                onClick={() => onTaskUpdate(task)}
                key={task.id}
                className={`
                relative cursor-pointer
                rounded-[5px] bg-[#607d8b] px-1 text-start text-white`}
              >
                <div className="truncate">{task.title}</div>
              </div>
            )
          })}
        </div>
      </div>
    </>,
    document.body,
  )
}
