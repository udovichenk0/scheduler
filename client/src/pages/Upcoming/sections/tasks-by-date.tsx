import { useUnit } from "effector-react"
import { useContext, useEffect } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { EditableTask } from "@/widgets/editable-task"

import { Task } from "@/entities/task/type"

import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { SDate } from "@/shared/lib/date/lib"

import { TaskManagerContext } from "../model"

export const TasksByDate = ({
  onSelectTaskId,
  tasks,
  date,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
  tasks: Task[]
  date: SDate
}) => {
  const { $$updateTask, $$createTask } = useContext(TaskManagerContext)

  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const onChangeCreateDate = useUnit($$createTask.dateChanged)

  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null),
  })

  const { isOpened: isCreateFormOpened, close: onCloseCreateForm } =
    useDisclosure({ id: ModalName.CreateTaskForm, onClose: onCreateTask })

  useEffect(() => {
    onChangeCreateDate({ startDate: date, dueDate: null })
  }, [date])

  return (
    <section className="h-full pt-2">
      {tasks?.map((task, id) => {
        return (
          <EditableTask
            ref={(node) => addNode(node!, id)}
            key={task.id}
            $$updateTask={$$updateTask}
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
        modifyTaskModel={$$createTask}
        dateModifier={true}
        closeTaskForm={onCloseCreateForm}
      />
    </section>
  )
}
