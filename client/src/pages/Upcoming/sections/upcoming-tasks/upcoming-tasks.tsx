import { useUnit } from "effector-react"
import { RefObject, MouseEvent } from "react"
import { Store } from "effector"

import { TaskId } from "@/shared/api/task"

import { SectionRoot } from "../../ui/date-section/root"

import { $generateTasks } from "./upcoming-tasks.model"

export const AllUpcomingTasks = ({
  $selectedDate,
  changeDate,
  taskRef,
  selectTaskId,
  selectedTaskId,
  $nextDate,
}: {
  $selectedDate: Store<Date>
  changeDate: (date: Date) => void
  taskRef: RefObject<HTMLDivElement>
  selectTaskId: (e: MouseEvent, taskId: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  $nextDate: Store<Date>
}) => {
  const selectedDate = useUnit($selectedDate)
  const nextDate = useUnit($nextDate)
  const generatedTasks = useUnit($generateTasks)

  return (
    <>
      {generatedTasks.map(({ tasks, title, date }) => {
        return (
          <SectionRoot key={title}>
            <SectionRoot.Header
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={date.isSame(nextDate, "day")}
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
