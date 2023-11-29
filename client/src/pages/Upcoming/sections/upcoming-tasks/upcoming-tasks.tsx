import { useUnit } from "effector-react"
import { RefObject } from "react"
import { Store } from "effector"
import dayjs, { Dayjs } from "dayjs"

import { Task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

import { SectionRoot } from "../../ui/date-section/root"

export const AllUpcomingTasks = ({
  $selectedDate,
  changeDate,
  taskRef,
  tasks,
  selectTaskId,
  selectedTaskId,
}: {
  $selectedDate: Store<Date>
  changeDate: (date: Date) => void
  taskRef: RefObject<HTMLDivElement>
  selectTaskId: (taskId: Nullable<TaskId>) => void
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
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={dayjs(selectedDate).isSame(date, "day")}
            >
              {title}
            </SectionRoot.Header>
            <SectionRoot.Content
              selectedTaskId={selectedTaskId}
              selectTaskId={selectTaskId}
              taskRef={taskRef}
              isSelected={date.isSame(selectedDate, "day")}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    </>
  )
}
