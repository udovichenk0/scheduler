import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  $$taskAccordion,
} from "./upcoming.model"
import { Layout } from "@/templates/main"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTask, selectTask] = useState<{ id: number } | null>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    startDate,
    changeDate,
    deleteTask,
  ] = useUnit([
    $$taskAccordion.closeTaskTriggered,
    $$taskAccordion.createTaskToggled,
    $selectedDate,
    currentDateSelected,
    $$deleteTask.taskDeleted,
  ])
  return (
    <Layout>
      <Layout.Header iconName="common/upcoming" title="Upcoming" />
      <Layout.Content
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
      </Layout.Content>
      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened({ date: startDate })}
      />
    </Layout>
  )
}
