import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/templates/main"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { TaskId } from "@/shared/api/task"
import { useDocumentTitle } from "@/shared/lib/react"

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
  FactoriesContext,
  $$createTask,
  $$updateTask,
  $tasksByDateKv,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  useDocumentTitle(t('task.upcoming'))

  const [selectedTaskId, selectTaskId] = useState<Nullable<TaskId>>(null)
  const [
    closeTask,
    openCreatedTask,
    changeDate,
    deleteTaskById,
    tasks,
    variant,
    selectVariant,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    currentDateSelected,
    $$deleteTask.taskDeletedById,
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
      <Layout.Content
        className="flex flex-col"
        onClick={(e) => onClickOutside(ref, e, closeTask)}
      >
        <UpcomingVariantChanger
          setUpcomingVariant={selectVariant}
          variant={variant}
          $tasksByDateKv={$tasksByDateKv}
        />
        <FactoriesContext.Provider
          value={{
            $$createTask,
            $$updateTask,
            $$taskDisclosure,
          }}
        >
          {variant === "upcoming" ? (
            <AllUpcomingTasks
              $nextDate={$nextDate}
              selectTaskId={selectTaskId}
              selectedTaskId={selectedTaskId}
              changeDate={changeDate}
              $selectedDate={$selectedDate}
              taskRef={ref}
            />
          ) : (
            <TasksByDate
              date={variant}
              tasks={tasks}
              taskRef={ref}
              selectTaskId={selectTaskId}
              selectedTaskId={selectedTaskId}
            />
          )}
        </FactoriesContext.Provider>
      </Layout.Content>
      <Layout.Footer
        selectedTaskId={selectedTaskId}
        deleteTask={deleteTaskById}
        action={openCreatedTask}
      />
    </Layout>
  )
}

export default Upcoming
