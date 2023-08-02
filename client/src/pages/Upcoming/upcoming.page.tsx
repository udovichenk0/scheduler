import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  taskAccordion,
} from "./upcoming.model"
import { MainLayout } from "@/templates/main"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTask, selectTask] = useState<{id: number} | null>(null)
  const [
    closeTaskTriggered, 
    createTaskOpened, 
    startDate, 
    changeDate,
    deleteTask
  ] = useUnit(
    [
      taskAccordion.closeTaskTriggered,
      taskAccordion.createTaskToggled,
      $selectedDate,
      currentDateSelected,
      $$deleteTask.taskDeleted
    ],
  )
  return (
    <MainLayout
      isTaskSelected={!!selectedTask}
      deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
      action={() => createTaskOpened({ date: startDate })}
      iconName="common/upcoming"
      title="Upcoming"
    >
      <div
        className="h-full"
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
      >
        <AllUpcomingTasks
          selectTask={selectTask}
          selectedTask={selectedTask}
          changeDate={changeDate}
          selectedDate={startDate}
          outRef={ref}
        />
      </div>
    </MainLayout>
  )
}
