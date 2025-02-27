import dayjs, { Dayjs } from "dayjs"

import { Task } from "@/entities/task"

import { TaskId } from "@/shared/api/task"

import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { Fragment, ReactNode, useContext, useEffect, useState } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { EditableTask } from "@/widgets/editable-task"
import { useUnit } from "effector-react"
import { TaskManagerContext } from "../../upcoming.model"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { getToday } from "@/shared/lib/date"

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
  const { close: onClose } = useDisclosure({id: ModalName.CreateTaskForm})
  const [selectedSection, setSelectedSection] = useState<Nullable<Date>>(null)
  useEffect(() => {
    setSelectedSection(getToday())
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

const Header = ({onClick, isSelected, children}:{onClick: () => void, isSelected: boolean, children: ReactNode}) => {
  return (
    <div className="border-b border-cBorder p-2 px-3 pl-9 text-primary">
      <button
        onMouseDown={onClick}
        onFocus={onClick}
        className={`${
          isSelected && "cursor-pointer bg-cFocus"
        } flex focus-visible:border-4 w-full items-center gap-2 rounded-[5px] px-3 text-lg enabled:hover:bg-hover `}
      >
        {children}
      </button>
    </div>
  )
}

const Section = ({tasks, onSelectTaskId, isSelected}: {tasks: Task[], onSelectTaskId: (taskId: Nullable<TaskId>) => void, isSelected: boolean}) => {
  const { $$createTask, $$updateTask } = useContext(TaskManagerContext)
  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const {isOpened: isCreateTaskFormOpened, close: onCloseCreateTaskForm} = useDisclosure({id: ModalName.CreateTaskForm, onClose: onCreateTask})
  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null)
  })

  return (
    <>
      {!!tasks.length && (
        <div className="select-none border-cBorder text-primary">
            <div className="pt-2">
              {tasks.map((task, id) => {
                return (
                  <div className="border-cBorder px-3 pb-2 last:border-b" key={task.id}>
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
        className="border-b border-cBorder px-3 py-2"
        dateModifier={true}
        modifyTaskModel={$$createTask}
        closeTaskForm={onCloseCreateTaskForm}
      />
    </>
  )
}