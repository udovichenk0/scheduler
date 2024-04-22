import { useUnit } from "effector-react"
import { MouseEvent, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main"

import { Sort } from "@/entities/task/task-item"

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
  $tasksByDate,
  $$selectTask,
  $$sort,
  selectTaskIdWithSectionTitle,
  $tasks,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
import { SORT_CONFIG } from "./config"

const Upcoming = () => {
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  useDocumentTitle(t("task.upcoming"))
  const upcomingTasks = useUnit($tasks)
  const tasksByDate = useUnit($tasksByDate)
  const variant = useUnit($variant)
  const selectedTaskId = useUnit($$selectTask.$selectedTaskId)
  const activeSort = useUnit($$sort.$sortType)

  const onCloseTaskForm = useUnit($$taskDisclosure.closeTaskTriggered)
  const onCreateTaskFormOpen = useUnit($$taskDisclosure.createdTaskOpened)
  const onChangeDate = useUnit(currentDateSelected)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSelectViewVariant = useUnit(variantSelected)
  const onSelectTaskId = useUnit($$selectTask.selectTaskId)
  const onSelectTaskIdWithSection = useUnit(selectTaskIdWithSectionTitle)
  const onSortChange = useUnit($$sort.sort)

  const resetSelectedTaskId = (e: MouseEvent) => {
    const t = e.target as HTMLDivElement
    if (t.id != "task") {
      onSelectTaskId(null)
    }
  }
  return (
    <Layout>
      <Layout.Header
        slot={
          <Sort
            sorting={{
              onChange: onSortChange,
              active: activeSort,
              config: SORT_CONFIG,
            }}
          />
        }
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
              onSelectTaskId={onSelectTaskIdWithSection}
              onChangeDate={onChangeDate}
              tasks={upcomingTasks}
              selectedTaskId={selectedTaskId}
              $selectedDate={$selectedDate}
              taskRef={expandedTaskRef}
            />
          ) : (
            <TasksByDate
              onSelectTaskId={onSelectTaskId}
              date={variant}
              tasks={tasksByDate}
              taskRef={expandedTaskRef}
              selectedTaskId={selectedTaskId}
            />
          )}
        </TaskManagerContext.Provider>
      </Layout.Content>
      <Layout.Footer
        onDeleteTask={onDeleteTask}
        onCreateTask={onCreateTaskFormOpen}
        selectedTaskId={selectedTaskId}
      />
    </Layout>
  )
}

export default Upcoming
