import dayjs, { Dayjs } from "dayjs"
import { Fragment, ReactNode, useContext, useEffect, useState } from "react"
import { useUnit } from "effector-react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { EditableTask } from "@/widgets/editable-task"

import { Task } from "@/entities/task"

import { TaskId } from "@/shared/api/task"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { getToday } from "@/shared/lib/date"

import { TaskManagerContext } from "../../upcoming.model"

export const UpcomingTasks = ({
  onChangeDate,
  onSelectTaskId,
  tasks,
}: {
  onChangeDate: (date: Date) => void
  onSelectTaskId: (taskId: Nullable<TaskId>) => void
  tasks: {
    tasks: Task[]
    title: string
    date: Dayjs
  }[]
}) => {
  const { close: onClose } = useDisclosure({ id: ModalName.CreateTaskForm })
  const [selectedSection, setSelectedSection] = useState<Nullable<Date>>(null)
  useEffect(() => {
    setSelectedSection(getToday().toDate())
  }, [])
  return (
    <>
      {tasks.map(({ tasks, title, date }) => {
        return (
          <Fragment key={title}>
            <Header
              onClick={() => {
                onClose()
                onChangeDate(new Date(date.toISOString()))
                setSelectedSection(date.toDate())
              }}
              isSelected={dayjs(selectedSection).isSame(date, "day")}
            >
              {title}
            </Header>
            <Section
              onSelectTaskId={onSelectTaskId}
              isSelected={date.isSame(selectedSection, "day")}
              tasks={tasks}
            />
          </Fragment>
        )
      })}
    </>
  )
}

const Header = ({
  onClick,
  isSelected,
  children,
}: {
  onClick: () => void
  isSelected: boolean
  children: ReactNode
}) => {
  return (
    <div className="border-cBorder text-primary border-b p-2 px-3 pl-9">
      <button
        onMouseDown={onClick}
        onFocus={onClick}
        className={`${
          isSelected && "bg-cFocus cursor-pointer"
        } enabled:hover:bg-hover flex w-full items-center gap-2 rounded-[5px] px-3 text-lg focus-visible:border-4 `}
      >
        {children}
      </button>
    </div>
  )
}

const Section = ({
  tasks,
  onSelectTaskId,
  isSelected,
}: {
  tasks: Task[]
  onSelectTaskId: (taskId: Nullable<TaskId>) => void
  isSelected: boolean
}) => {
  const { $$createTask, $$updateTask } = useContext(TaskManagerContext)
  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const { isOpened: isCreateTaskFormOpened, close: onCloseCreateTaskForm } =
    useDisclosure({ id: ModalName.CreateTaskForm, onClose: onCreateTask })
  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null),
  })

  return (
    <>
      {!!tasks.length && (
        <div className="border-cBorder text-primary select-none">
          <div className="pt-2">
            {tasks.map((task, id) => {
              return (
                <div
                  className="border-cBorder px-3 pb-2 last:border-b"
                  key={task.id}
                >
                  <EditableTask
                    ref={(node) => addNode(node!, id)}
                    key={task.id}
                    $$updateTask={$$updateTask}
                    task={task}
                    typeLabel
                    dateLabel
                    onSelect={() => onSelect(id)}
                    onBlur={onUnselect}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
      <ExpandedTask
        isExpanded={isCreateTaskFormOpened && isSelected}
        className="border-cBorder border-b px-3 py-2"
        dateModifier={true}
        modifyTaskModel={$$createTask}
        closeTaskForm={onCloseCreateTaskForm}
      />
    </>
  )
}
