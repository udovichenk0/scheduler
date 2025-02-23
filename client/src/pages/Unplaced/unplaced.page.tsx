import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { Sort } from "@/entities/task"

import { NoTasks } from "@/shared/ui/no-tasks"
import { useDocumentTitle } from "@/shared/lib/react"

import {
  $$createTask,
  $$trashTask,
  $$sort,
  $$updateTask,
  $unplacedTasks,
  $$taskModel,
} from "./unplaced.model"
import { SORT_CONFIG } from "./config"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { EditableTask } from "@/widgets/editable-task"
import { useState } from "react"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

const Unplaced = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.unplaced"))

  const tasks = useUnit($unplacedTasks)
  const activeSort = useUnit($$sort.$sortType)

  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const onSortChange = useUnit($$sort.sort)

  const {
    isOpened: isCreateFormOpened, 
    open: onOpenCreateForm, 
    close: onCloseCreateForm
  } = useDisclosure({id: ModalName.CreateTaskForm, onClose: onCreateTask})

  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)

  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<string>>(null)
  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => setSelectedTaskId(task?.id || null)
  })

  return (
    <Layout>
      <Layout.Header
        iconName="common/cross-arrows"
        title={t("task.unplaced")}
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
      />
      <Layout.Content>
        {tasks?.map((task, index) => {
          return (
            <div className="px-3 pb-2" key={task.id}>
              <EditableTask
                ref={(node) => addNode(node!, index)}
                $$updateTask={$$updateTask}
                dateLabel
                task={task}
                onSelect={() => onSelect(index)}
                onBlur={onUnselect}
              />
            </div>
          )
        })}
        <NoTasks isTaskListEmpty={!tasks?.length && !isCreateFormOpened} />
        <ExpandedTask
          className="mx-3"
          isExpanded={isCreateFormOpened}
          modifyTaskModel={$$createTask}
          dateModifier={false}
          closeTaskForm={onCloseCreateForm}
        />
      </Layout.Content>
      <Layout.Footer
        isTrashDisabled={!selectedTaskId}
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
        onCreateTask={onOpenCreateForm}
      />
    </Layout>
  )
}

export default Unplaced
