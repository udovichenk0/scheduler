import { useUnit } from "effector-react"
import { useContext } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { EditableTask } from "@/widgets/editable-task"

import { Task } from "@/entities/task/type"

import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { useSelectItem } from "@/shared/lib/use-select-item"

import { TaskManagerContext } from "../model"

export const TasksByDate = ({
  onSelectTaskId,
  tasks,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
  tasks: Task[]
}) => {
  const { $$taskUpdater, $$taskCreator, $$taskTrasher } =
    useContext(TaskManagerContext)

  const onCreateTask = useUnit($$taskCreator.createTaskTriggered)

  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null),
  })

  const { isOpened: isCreateFormOpened, close: onCloseCreateForm } =
    useDisclosure({ id: ModalName.CreateTaskForm, onClose: onCreateTask })

  return (
    <section className="h-full pt-2">
      {tasks?.map((task, id) => {
        return (
          <EditableTask
            ref={(node) => addNode(node!, id)}
            key={task.id}
            $$taskUpdater={$$taskUpdater}
            $$taskRemover={$$taskTrasher}
            task={task}
            onSelect={() => onSelect(id)}
            onBlur={onUnselect}
          />
        )
      })}
      <NoTasks isTaskListEmpty={!tasks?.length && !isCreateFormOpened} />
      <ExpandedTask
        className="mx-3"
        isExpanded={isCreateFormOpened}
        $$taskManager={$$taskCreator}
        dateModifier={true}
        closeTaskForm={onCloseCreateForm}
      />
    </section>
  )
}
