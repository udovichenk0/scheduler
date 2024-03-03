import { useUnit } from "effector-react"
import { RefObject } from "react"
import { Store } from "effector"
import dayjs, { Dayjs } from "dayjs"

import { Task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

import { SectionRoot } from "../../ui/date-section/root"

export const AllUpcomingTasks = ({
  onChangeDate,
  onSelectTaskId,
  $selectedDate,
  taskRef,
  tasks,
  selectedTaskId,
}: {
  onChangeDate: (date: Date) => void
  onSelectTaskId: (args: {taskId: TaskId, section: string}) => void
  $selectedDate: Store<Date>
  taskRef: RefObject<HTMLDivElement>
  tasks: {
    tasks: Task[]
    title: string
    date: Dayjs
  }[]
  selectedTaskId: Nullable<TaskId>
}) => {
  const selectedDate = useUnit($selectedDate)

  return (
    <>
      {tasks.map(({ tasks, title, date }) => {
        return (
          <SectionRoot key={title}>
            <SectionRoot.Header
              action={() => onChangeDate(new Date(date.toISOString()))}
              isNextSelectedTask={dayjs(selectedDate).isSame(date, "day")}
            >
              {title}
            </SectionRoot.Header>
            <SectionRoot.Content
              onSelectTaskId={onSelectTaskId}
              isSelected={date.isSame(selectedDate, "day")}
              selectedTaskId={selectedTaskId}
              section={title}
              taskRef={taskRef}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    </>
  )
}
