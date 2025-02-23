import { Task, TaskItem } from "@/entities/task"
import { ExpandedTask } from "../expanded-task"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { UpdateTaskFactory } from "@/features/manage-task/update"
import { useUnit } from "effector-react"
import { ReactNode, Ref } from "react"
import { ModalName } from "@/shared/lib/modal/modal-names"

type EditableTaskProps = {
  task: Task,
  $$updateTask: UpdateTaskFactory
  onSelect: () => void
  onBlur: (el: Element) => void
  dateLabel?: boolean
  typeLabel?: boolean
  formDateModifier?: boolean
  formSideDatePicker?: boolean
  formRightPanelSlot?: ReactNode
  ref: Ref<HTMLButtonElement>
}

export const EditableTask = ({
  task,
  $$updateTask,
  dateLabel = false,
  typeLabel = false,
  onSelect,
  onBlur,
  formDateModifier = true,
  formSideDatePicker = true,
  ref
}: EditableTaskProps) => {
  const onInitFields = useUnit($$updateTask.init)
  const onUpdateTask = useUnit($$updateTask.updateTaskTriggered)
  const onUpdateStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onUpdateDate = useUnit($$updateTask.dateChangedAndUpdated)

  const {
    isOpened: isUpdateFormOpened, 
    open: onOpenUpdateForm, 
    close: onCloseUpdateForm,
  } = useDisclosure({prefix: ModalName.UpdateTaskForm, onClose: onUpdateTask})

  return (
    <div className=" not-last:mb-2">
      <ExpandedTask
        sideDatePicker={formSideDatePicker}
        isExpanded={isUpdateFormOpened}
        dateModifier={formDateModifier}
        modifyTaskModel={$$updateTask}
        closeTaskForm={onCloseUpdateForm}
      />
      <TaskItem
        ref={ref}
        isShown={!isUpdateFormOpened}
        dateLabel={dateLabel}
        typeLabel={typeLabel}
        onUpdateDate={onUpdateDate}
        onUpdateStatus={onUpdateStatus}
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