import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main"

import { Sort } from "@/entities/task"

import { useDocumentTitle } from "@/shared/lib/react"

import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$trashTask,
  $selectedDate,
  currentDateSelected,
  $variant,
  variantSelected,
  TaskManagerContext,
  $$createTask,
  $$updateTask,
  $tasksByDateKv,
  $tasksByDate,
  $$sort,
  $tasks,
  $$taskModel,
} from "./upcoming.model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/upcoming-variant-changer/variant-changer"
import { SORT_CONFIG } from "./config"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { useState } from "react"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

const Upcoming = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.upcoming"))
  const upcomingTasks = useUnit($tasks)
  const tasksByDate = useUnit($tasksByDate)
  const variant = useUnit($variant)
  const activeSort = useUnit($$sort.$sortType)

  const onChangeDate = useUnit(currentDateSelected)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSelectViewVariant = useUnit(variantSelected)
  const onSortChange = useUnit($$sort.sort)
  const date = useUnit($selectedDate)
  const setDate = useUnit($$createTask.setDate)
  const { open: onOpenCreateForm } = useDisclosure({id: ModalName.CreateTaskForm})
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)
  
  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<string>>(null)

  return (
    <Layout>
      <Layout.Header
        slot={
          <>
            <Sort
              sorting={{
                onChange: onSortChange,
                active: activeSort,
                config: SORT_CONFIG,
              }}
            />
            <CompletedToggle checked={isCompletedShown} onToggle={onToggleCompleted}/>
          </>
        }
        iconName="common/upcoming"
        title={<HeaderTitle variant={variant} />}
      />
      <Layout.Content className="flex flex-col">
        <UpcomingVariantChanger
          setUpcomingVariant={onSelectViewVariant}
          variant={variant}
          $tasksByDateKv={$tasksByDateKv}
        />
        <TaskManagerContext.Provider
          value={{
            $$createTask,
            $$updateTask,
          }}
        >
          {variant === "upcoming" ? (
            <AllUpcomingTasks
              onSelectTaskId={setSelectedTaskId}
              onChangeDate={onChangeDate}
              tasks={upcomingTasks}
            />
          ) : (
            <TasksByDate
              onSelectTaskId={setSelectedTaskId}
              date={variant}
              tasks={tasksByDate}
            />
          )}
        </TaskManagerContext.Provider>
      </Layout.Content>
      <Layout.Footer
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
        onCreateTask={() => {
          onOpenCreateForm()
          setDate(date)
        }}
        isTrashDisabled={!selectedTaskId}
      />
    </Layout>
  )
}

export default Upcoming
