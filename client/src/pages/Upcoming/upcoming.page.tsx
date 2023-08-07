import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { onClickOutside } from "@/shared/lib/on-click-outside"

import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  $$taskAccordion,
} from "./upcoming.model"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    selectedDate,
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
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
      >
        <AllUpcomingTasks
          selectTask={selectTask}
          selectedTask={selectedTask}
          changeDate={changeDate}
          selectedDate={selectedDate}
          outRef={ref}
        />
      </Layout.Content>
      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened({ date: selectedDate })}
      />
    </Layout>
  )
}
