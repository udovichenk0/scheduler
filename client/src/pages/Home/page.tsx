import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"

import { Layout } from "@/widgets/layout/main/ui.tsx"

import { Sort } from "@/entities/task/ui/sorting.tsx"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

import { NoTasks } from "@/shared/ui/no-tasks"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"

import { SORT_CONFIG } from "./config"
import {
  $$taskTrasher,
  $$sort,
  $$taskModel,
  $privateTasks,
  // $$listModel,
  $$taskCreator,
  $$taskUpdater,
  $$projectModel,
} from "./model"
import { TaskList } from "@/widgets/task/task-list"

const Home2 = () => {
  const { t } = useTranslation()
  const activeSort = useUnit($$sort.$sortType)
  const onTrashTask = useUnit($$taskTrasher.trashTaskById)
  const onSortChange = useUnit($$sort.sort)
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)
  const project = useUnit($$projectModel.$privateProject)

  const [selectedPayload, setSelectedPayload] = useState<Nullable<string>>(null)
  return (
    <Layout title={t("task.inbox")}>
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
        iconName="common/inbox"
        title="Home"
      />
      <Layout.Content className="flex flex-col px-3">
        {project && (
          <TaskList
            $tasks={$privateTasks}
            $$taskCreator={$$taskCreator}
            $$taskRemover={$$taskTrasher}
            $$taskUpdater={$$taskUpdater}
            listId={project.list.id}
          />
        )}
        {/*<NoTasks isTaskListEmpty={!tasks?.length && !isCreateFormOpened} />*/}
      </Layout.Content>
      <Layout.Footer
        isTrashDisabled={!selectedPayload}
        onDeleteTask={() => selectedPayload && onTrashTask(selectedPayload)}
      />
    </Layout>
  )
}

export default Home2
