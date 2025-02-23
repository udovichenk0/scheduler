import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { Sort } from "@/entities/task"

import { NoTasks } from "@/shared/ui/no-tasks"
import {
  useDocumentTitle,
} from "@/shared/lib/react"

import {
  $$trashTask,
  $$updateTask,
  $$createTask,
  $$sort,
  $inboxTasks,
  $$taskModel
} from "./inbox.model"
import { SORT_CONFIG } from "./config"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { EditableTask } from "@/widgets/editable-task"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { useState } from "react"

const Inbox = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.inbox"))
  const tasks = useUnit($inboxTasks)

  const activeSort = useUnit($$sort.$sortType)

  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const onTrashTask = useUnit($$trashTask.taskTrashedById)
  const onSortChange = useUnit($$sort.sort)
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)
  const [selectedPayload, setSelectedPayload] = useState<Nullable<string>>(null)
  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => setSelectedPayload(task?.id || null)
  })

  const {
    isOpened: isCreateFormOpened, 
    open: onOpenCreateForm, 
    close: onCloseCreateForm
  } = useDisclosure({id: ModalName.CreateTaskForm, onClose: onCreateTask})

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
        iconName="common/inbox"
        title={t("task.inbox")}
      />
      <Layout.Content className="flex flex-col px-3">
        {tasks?.map((task, index) => {
          return (
            <EditableTask
              formDateModifier={false}
              key={task.id}
              ref={(node) => addNode(node!, index)}
              $$updateTask={$$updateTask}
              task={task}
              onSelect={() => onSelect(index)}
              onBlur={onUnselect}
            />
          )
        })}
        <ExpandedTask
          isExpanded={isCreateFormOpened}
          modifyTaskModel={$$createTask}
          dateModifier={false}
          closeTaskForm={onCloseCreateForm}
        />
        <NoTasks isTaskListEmpty={!tasks?.length && !isCreateFormOpened} />
      </Layout.Content>

      <Layout.Footer
        isTrashDisabled={!selectedPayload}
        onDeleteTask={() => selectedPayload && onTrashTask(selectedPayload)}
        onCreateTask={() => onOpenCreateForm()}
      />
    </Layout>
  )
}

export default Inbox