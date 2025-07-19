import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"

import { Layout } from "@/widgets/layout/main/ui.tsx"

import { Sort } from "@/entities/task/ui/sorting.tsx"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { Tabs } from "@/shared/ui/tab"
import { getToday } from "@/shared/lib/date/lib"

import { UpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$taskRemover,
  $upcomingDate,
  upcomingDateSelected,
  TaskManagerContext,
  $$taskCreator,
  $$taskUpdater,
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
  const [d, setD] = useState(getToday())
  const upcomingTasks = useUnit($tasks)
  const tasksByDate = useUnit($tasksByDate)
  const upcomingDate = useUnit($upcomingDate)
  const activeSort = useUnit($$sort.$sortType)

  const onDeleteTask = useUnit($$taskRemover.taskTrashedById)
  const onSelectViewVariant = useUnit(upcomingDateSelected)
  const onSortChange = useUnit($$sort.sort)
  const onChangeCreateDate = useUnit($$taskCreator.dateChanged)
  const { open: onOpenCreateForm } = useDisclosure({
    id: ModalName.CreateTaskForm,
    onOpen: () => onChangeCreateDate({ startDate: d, dueDate: null }),
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
            $$taskCreator,
            $$taskUpdater,
          }}
        >
          <Tabs defaultValue="upcoming">
            <Tabs.List>
              <UpcomingVariantChanger
                setUpcomingVariant={(date) => {
                  setD(date || getToday())
                  onSelectViewVariant(date)
                }}
                upcomingDate={upcomingDate}
                $tasksByDateKv={$tasksByDateKv}
              />
            </Tabs.List>
            <Tabs.Content label="upcoming">
              <UpcomingTasks
                onSelectTaskId={setSelectedTaskId}
                onChangeDate={setD}
                tasks={upcomingTasks}
              />
            </Tabs.Content>
            <Tabs.Content label="date">
              <TasksByDate
                onSelectTaskId={setSelectedTaskId}
                tasks={tasksByDate}
              />
            </Tabs.Content>
          </Tabs>
        </TaskManagerContext.Provider>
      </Layout.Content>
      <Layout.Footer
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
        onCreateTask={onOpenCreateForm}
        isTrashDisabled={!selectedTaskId}
      />
    </Layout>
  )
}

export default Upcoming
