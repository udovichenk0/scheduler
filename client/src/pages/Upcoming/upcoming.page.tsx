import { useUnit } from "effector-react"
import { MouseEvent, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main"

import { useDocumentTitle, onClickOutside } from "@/shared/lib/react"

import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  $$taskDisclosure,
  $variant,
  variantSelected,
  TaskManagerContext,
  $$createTask,
  $$updateTask,
  $tasksByDateKv,
  $upcomingTasks,
  $tasksByDate,
  selectTaskId,
  $selectedTaskId,
  $$filter,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
import { FILTER_CONFIG } from "./config"
const Upcoming = () => {
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  useDocumentTitle(t("task.upcoming"))

  const closeTask = useUnit($$taskDisclosure.closeTaskTriggered)
  const openCreatedTask = useUnit($$taskDisclosure.createdTaskOpened)
  const changeDate = useUnit(currentDateSelected)
  const deleteTaskById = useUnit($$deleteTask.taskDeletedById)
  const upcomingTasks = useUnit($upcomingTasks)
  const tasksByDate = useUnit($tasksByDate)
  const variant = useUnit($variant)
  const selectVariant = useUnit(variantSelected)
  const onSelectUpcomingTaskId = useUnit(selectTaskId)
  const selectedTaskId = useUnit($selectedTaskId)
  const sortType = useUnit($$filter.$sortType)
  const onFilter = useUnit($$filter.sort)

  const resetSelectedTaskId = (e: MouseEvent) => {
    const t = e.target as HTMLDivElement
    if (t.id != "task") {
      onSelectUpcomingTaskId(null)
    }
  }
  return (
    <Layout>
      <Layout.Header
        filter={{
          config: FILTER_CONFIG,
          active: sortType,
          onChange: onFilter,
        }}
        iconName="common/upcoming"
        title={<HeaderTitle variant={variant} />}
      />
      <Layout.Content
        className="flex flex-col"
        onClick={(e) => {
          resetSelectedTaskId(e)
          onClickOutside(expandedTaskRef, e, closeTask)
        }}
      >
        <UpcomingVariantChanger
          setUpcomingVariant={selectVariant}
          variant={variant}
          $tasksByDateKv={$tasksByDateKv}
        />
        <TaskManagerContext.Provider
          value={{
            $$createTask,
            $$updateTask,
            $$taskDisclosure,
          }}
        >
          {variant === "upcoming" ? (
            <AllUpcomingTasks
              tasks={upcomingTasks}
              selectTaskId={onSelectUpcomingTaskId}
              selectedTaskId={selectedTaskId}
              changeDate={changeDate}
              $selectedDate={$selectedDate}
              taskRef={expandedTaskRef}
            />
          ) : (
            <TasksByDate
              date={variant}
              tasks={tasksByDate}
              taskRef={expandedTaskRef}
              selectTaskId={onSelectUpcomingTaskId}
              selectedTaskId={selectedTaskId}
            />
          )}
        </TaskManagerContext.Provider>
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
