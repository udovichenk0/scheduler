import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"

import { Layout } from "@/widgets/layout/main/ui.tsx"

import { Sort } from "@/entities/task/ui/sorting.tsx"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { Root } from "@/shared/ui/tab"

import { UpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$trashTask,
  // $selectedDate,
  // currentDateSelected,
  $upcomingDate,
  upcomingDateSelected,
  TaskManagerContext,
  $$createTask,
  $$updateTask,
  $tasksByDateKv,
  $tasksByDate,
  $$sort,
  $tasks,
  $$taskModel,
} from "./model"
import { TasksByDate } from "./sections/tasks-by-date"
import { HeaderTitle } from "./ui/header-title"
import { UpcomingVariantChanger } from "./ui/variant-changer"
import { SORT_CONFIG } from "./config"

const Upcoming = () => {
  const { t } = useTranslation()
  const upcomingTasks = useUnit($tasks)
  const tasksByDate = useUnit($tasksByDate)
  const upcomingDate = useUnit($upcomingDate)
  const activeSort = useUnit($$sort.$sortType)

  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSelectViewVariant = useUnit(upcomingDateSelected)
  const onSortChange = useUnit($$sort.sort)
  const setDate = useUnit($$createTask.setDate)
  const { open: onOpenCreateForm } = useDisclosure({
    id: ModalName.CreateTaskForm,
  })
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)

  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<string>>(null)

  return (
    <Layout title={t("task.upcoming")}>
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
            <CompletedToggle
              checked={isCompletedShown}
              onToggle={onToggleCompleted}
            />
          </>
        }
        iconName="common/upcoming"
        title={<HeaderTitle date={upcomingDate} />}
      />
      <Layout.Content className="flex flex-col">
        <TaskManagerContext.Provider
          value={{
            $$createTask,
            $$updateTask,
          }}
        >
          <Root defaultValue="upcoming">
            <Root.List>
              <UpcomingVariantChanger
                setUpcomingVariant={onSelectViewVariant}
                upcomingDate={upcomingDate}
                $tasksByDateKv={$tasksByDateKv}
              />
            </Root.List>
            <Root.Content label="upcoming">
              <UpcomingTasks
                onSelectTaskId={setSelectedTaskId}
                onChangeDate={setDate}
                tasks={upcomingTasks}
              />
            </Root.Content>
            <Root.Content label="date">
              <TasksByDate
                onSelectTaskId={setSelectedTaskId}
                date={upcomingDate!}
                tasks={tasksByDate}
              />
            </Root.Content>
          </Root>
        </TaskManagerContext.Provider>
      </Layout.Content>
      <Layout.Footer
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
        onCreateTask={() => {
          onOpenCreateForm()
          // setDate(date)
        }}
        isTrashDisabled={!selectedTaskId}
      />
    </Layout>
  )
}

export default Upcoming
