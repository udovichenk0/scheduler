import { useUnit } from "effector-react"
import { ReactNode, Ref } from "react"

import { TaskUpdater } from "@/features/manage-task/update"
import { TaskRemover } from "@/features/manage-task/interface"

import { Task } from "@/entities/task/type"
import { TaskItem } from "@/entities/task/ui/item"

import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"

import { ExpandedTask } from "../expanded-task"

type EditableTaskProps = {
  task: Task
  $$taskUpdater: TaskUpdater
  $$taskRemover: TaskRemover
  onSelect: () => void
  onBlur: (el: Element) => void
  dateLabel?: boolean
  typeLabel?: boolean
  formDateModifier?: boolean
  formSideDatePicker?: boolean
  formRightPanelSlot?: ReactNode
  ref: Ref<HTMLDivElement>
}

export const EditableTask = ({
  task,
  $$taskUpdater,
  $$taskRemover,
  dateLabel = false,
  typeLabel = false,
  onSelect,
  onBlur,
  formDateModifier = true,
  formSideDatePicker = true,
  ref,
}: EditableTaskProps) => {
  const onInitFields = useUnit($$taskUpdater.init)
  const onUpdateTask = useUnit($$taskUpdater.updateTaskTriggered)
  const onUpdateStatus = useUnit($$taskUpdater.statusChangedAndUpdated)
  const onUpdateDate = useUnit($$taskUpdater.dateChangedAndUpdated)
  const onUpdatePriority = useUnit($$taskUpdater.priorityChangedAndUpdated)
  const onDeleteTask = useUnit($$taskRemover.removeTaskById)

  const {
    isOpened: isUpdateFormOpened,
    open: onOpenUpdateForm,
    close: onCloseUpdateForm,
  } = useDisclosure({ prefix: ModalName.UpdateTaskForm, onClose: onUpdateTask })

  return (
    <div className="not-last:mb-2">
      <ExpandedTask
        sideDatePicker={formSideDatePicker}
        isExpanded={isUpdateFormOpened}
        dateModifier={formDateModifier}
        $$taskManager={$$taskUpdater}
        closeTaskForm={onCloseUpdateForm}
      />
      <TaskItem
        ref={ref}
        isShown={!isUpdateFormOpened}
        dateLabel={dateLabel}
        typeLabel={typeLabel}
        onUpdateDate={onUpdateDate}
        onUpdateStatus={onUpdateStatus}
        onUpdatePriority={onUpdatePriority}
        onRemoveTask={onDeleteTask}
        onSelect={onSelect}
        onBlur={onBlur}
        onDoubleClick={() => {
          onOpenUpdateForm()
          onInitFields(task)
        }}
        task={task}
      />
    </div>
  )
}
