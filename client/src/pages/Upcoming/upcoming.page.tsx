import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { onClickOutside } from "@/shared/lib/on-click-outside"

import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  $$taskDisclosure,
  $nextDate,
  $tasksByDate,
  $variant,
  variantSelected,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer"

export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
  const [
    closeTask,
    openCreatedTask,
    selectedDate,
    changeDate,
    deleteTaskById,
    nextDate,
    tasks,
    variant,
    selectVariant,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    $selectedDate,
    currentDateSelected,
    $$deleteTask.taskDeletedById,
    $nextDate,
    $tasksByDate,
    $variant,
    variantSelected,
  ])
  return (
    <Layout>
      <Layout.Header
        iconName="common/upcoming"
        title={<HeaderTitle variant={variant} />}
      />
      <Layout.Content onClick={(e) => onClickOutside(ref, e, closeTask)}>
        <UpcomingVariantChanger
          setUpcomingVariant={selectVariant}
          variant={variant}
        />
        {variant === "upcoming" ? (
          <AllUpcomingTasks
            nextDate={nextDate}
            selectTask={selectTask}
            selectedTask={selectedTask}
            changeDate={changeDate}
            selectedDate={selectedDate}
            taskRef={ref}
          />
        ) : (
          <TasksByDate
            date={variant}
            tasks={tasks}
            taskRef={ref}
            selectTask={selectTask}
            selectedTask={selectedTask}
          />
        )}
      </Layout.Content>
      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTaskById(selectedTask.id)}
        action={() => openCreatedTask()}
      />
    </Layout>
  )
}
