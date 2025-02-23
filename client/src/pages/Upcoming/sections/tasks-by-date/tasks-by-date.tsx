import { useUnit } from "effector-react"
import { useContext, useEffect } from "react"
import { Dayjs } from "dayjs"

import { ExpandedTask } from "@/widgets/expanded-task"

import { Task } from "@/entities/task"

import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"

import {
  TaskManagerContext,
} from "../../upcoming.model"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { EditableTask } from "@/widgets/editable-task"
import { useSelectItem } from "@/shared/lib/use-select-item"

export const TasksByDate = ({
  onSelectTaskId,
  tasks,
  date,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
  tasks: Task[]
  date: Dayjs
}) => {
  const { $$updateTask, $$createTask } =
    useContext(TaskManagerContext)

  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const onChangeCreateDate = useUnit($$createTask.dateChanged)
  const onChangeUpdateDate = useUnit($$updateTask.dateChanged)

  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null)
  })

  const {
    isOpened: isCreateFormOpened, 
    close: onCloseCreateForm
  } = useDisclosure({id: ModalName.CreateTaskForm, onClose: onCreateTask})

  useEffect(() => {
    onChangeUpdateDate(date.toDate())
    onChangeCreateDate(date.toDate())
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
