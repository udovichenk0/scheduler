import { useUnit } from "effector-react"
import { MouseEvent, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main"

import { useDocumentTitle, onClickOutside } from "@/shared/lib/react"
import { TaskId } from "@/shared/api/task"

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
  upcomingTaskIdSelected,
  $selectedTaskId,
  $$selectTask,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
const Upcoming = () => {
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<Nullable<HTMLDivElement>>(null)
  const { t } = useTranslation()
  useDocumentTitle(t("task.upcoming"))
  const [
    closeTask,
    openCreatedTask,
    changeDate,
    deleteTaskById,
    tasks,
    variant,
    selectVariant,
    selectedTaskId,
    selectUpcoimingTaskId,
    selectTaskId,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    currentDateSelected,
    $$deleteTask.taskDeletedById,
    $tasksByDate,
    $variant,
    variantSelected,
    $selectedTaskId,
    upcomingTaskIdSelected,
    $$selectTask.taskIdSelected,
  ])
  const handleOnClick = (e: MouseEvent, taskId: Nullable<TaskId>) => {
    selectUpcoimingTaskId(taskId)
    taskItemRef.current = e.target as HTMLDivElement
  }
  const resetSelectedTaskId = (e: MouseEvent) => {
    if (taskItemRef.current && taskItemRef.current !== e.target) {
      if(taskItemRef.current !== e.target) selectUpcoimingTaskId(null)
      taskItemRef.current = null
    }
  }
  return (
    <Layout>
      <Layout.Header
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
              selectTaskId={handleOnClick}
              selectedTaskId={selectedTaskId}
              changeDate={changeDate}
              $selectedDate={$selectedDate}
              taskRef={expandedTaskRef}
            />
          ) : (
            <TasksByDate
              date={variant}
              tasks={tasks}
              taskRef={expandedTaskRef}
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
