import { useUnit } from "effector-react"
import { MouseEvent, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main"

import { useDocumentTitle, onClickOutside } from "@/shared/lib/react"

import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$trashTask,
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
  $$sort,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
import { SORT_CONFIG } from "./config"
const Upcoming = () => {
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  useDocumentTitle(t("task.upcoming"))

  const upcomingTasks = useUnit($upcomingTasks)
  const tasksByDate = useUnit($tasksByDate)
  const variant = useUnit($variant)
  const selectedTaskId = useUnit($selectedTaskId)
  const activeSort = useUnit($$sort.$sortType)
  
  const onCloseTaskForm = useUnit($$taskDisclosure.closeTaskTriggered)
  const onCreateTaskFormOpen = useUnit($$taskDisclosure.createdTaskOpened)
  const onChangeDate = useUnit(currentDateSelected)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSelectViewVariant = useUnit(variantSelected)
  const onSelectUpcomingTaskId = useUnit(selectTaskId)
  const onSortChange = useUnit($$sort.sort)


  const resetSelectedTaskId = (e: MouseEvent) => {
    const t = e.target as HTMLDivElement
    if (t.id != "task") {
      onSelectUpcomingTaskId(null)
    }
  }
  return (
    <Layout>
      <Layout.Header
        sorting={{
          config: SORT_CONFIG,
          active: activeSort,
          onChange: onSortChange,
        }}
        iconName="common/upcoming"
        title={<HeaderTitle variant={variant} />}
      />
      <Layout.Content
        className="flex flex-col"
        onClick={(e) => {
          resetSelectedTaskId(e)
          onClickOutside(expandedTaskRef, e, onCloseTaskForm)
        }}
      >
        <UpcomingVariantChanger
          setUpcomingVariant={onSelectViewVariant}
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
              changeDate={onChangeDate}
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
        onDeleteTask={onDeleteTask}
        onCreateTask={onCreateTaskFormOpen}
      />
    </Layout>
  )
}

export default Upcoming
