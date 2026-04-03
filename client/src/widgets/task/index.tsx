import {
  Priority as PriorityType,
  Task as TaskType,
} from "@/entities/task/type"
import { TaskUpdater } from "@/features/manage-task/update"
import { $$taskRemover } from "@/pages/Trash/model"
import { defaultDateFormat, SDate } from "@/shared/lib/date/lib"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { DatePickerV2 } from "@/shared/ui/date-picker"
import { Icon } from "@/shared/ui/icon"
import { Popover } from "@/shared/ui/disclosure/popover"
import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { Cell } from "./cell"
import { StatusIcon, StatusPopover } from "./status"
import { TaskView } from "./task-view"
import { Priorities, Priority } from "./priorities"
import { TaskTrasher } from "@/features/manage-task/trash"

const PriorityCell = ({
  priority,
  onUpdate,
}: {
  priority: PriorityType
  onUpdate: (priority: PriorityType) => void
}) => {
  const { isOpened, open, close } = useDisclosure({
    prefix: ModalName.PriorityPicker,
  })

  return (
    <Popover
      isOpened={isOpened}
      label="Select task priority"
      closeModal={close}
    >
      <Popover.Trigger
        asChild
        className="h-full hover:bg-transparent"
        onClick={open}
      >
        <Cell active={isOpened}>
          <Priority priority={priority} />
        </Cell>
      </Popover.Trigger>
      <Popover.Content className="w-50! mt-2">
        <Priorities onUpdate={onUpdate} priority={priority} />
      </Popover.Content>
    </Popover>
  )
}

const DateCell = ({
  task,
  onChangeDate,
}: {
  task: TaskType
  onChangeDate: (p: { start: Nullable<SDate>; due: Nullable<SDate> }) => void
}) => {
  const { isOpened, open, close, cancel } = useDisclosure({
    prefix: ModalName.DateModal,
  })
  return (
    <Popover label="Select task date" isOpened={isOpened} closeModal={close}>
      <Popover.Trigger
        asChild
        className="h-full hover:bg-transparent"
        onClick={open}
      >
        <Cell active={isOpened}>
          {!task.due_date && (
            <Icon
              className="text-cOpacitySecondFont text-base"
              name="common/calendar-plus"
            />
          )}
          {task.due_date && (
            <div className="text-sm">{defaultDateFormat(task.due_date)}</div>
          )}
        </Cell>
      </Popover.Trigger>
      <Popover.Content className="p-0! mt-2">
        <DatePickerV2
          startDate={task.start_date}
          dueDate={task.due_date}
          onCancel={cancel}
          onDateChange={(params) => {
            onChangeDate(params)
            close()
          }}
        />
      </Popover.Content>
    </Popover>
  )
}

type TaskRowProps = {
  task: TaskType
  className?: string
  $$taskUpdater: TaskUpdater
  $$taskTrasher: TaskTrasher
}

export const TaskListItem = ({
  task,
  className,
  $$taskUpdater,
}: TaskRowProps) => {
  const update = useUnit($$taskUpdater.updateTaskTriggered)

  const removeTask = useUnit($$taskRemover.deleteTaskById)
  return (
    <div
      className={clsx(
        "border-b-cBorder hover:bg-hover has-data-[active=true]:bg-hover has-data-[active=true]:**:data-stick:bg-hover text-cFont group relative flex h-9 w-full items-center gap-x-1 rounded-none border-b text-sm",
        className,
      )}
    >
      {/*select component*/}
      {/*create subtask component*/}
      <div className="min-w-75 bg-main sticky left-0 z-10 h-full w-full">
        <TaskView task={task} $$taskUpdater={$$taskUpdater}>
          <div
            data-stick
            className={clsx(
              "group-hover:bg-hover group-data-[active=true]:bg-hover flex h-full w-full items-center gap-x-1 px-4",
            )}
          >
            <StatusPopover onChange={(status) => update(task)}>
              <Button size="sxs">
                <StatusIcon status={task.status} />
              </Button>
            </StatusPopover>
            <div>{task.title}</div>
          </div>
        </TaskView>
      </div>
      <DateCell
        onChangeDate={({ start, due }) =>
          changeDateAndUpdate({ id: task.id, startDate: start, dueDate: due })
        }
        task={task}
      />
      <PriorityCell
        onUpdate={(priority) =>
          changePriorityAndUpdate({ id: task.id, priority })
        }
        priority={task.priority}
      />
      <Cell>{defaultDateFormat(task.date_created)}</Cell>
      <div className="px-4">
        <Button size="sxs" onClick={() => removeTask(task.id)}>
          <Icon className="text-red" name="common/trash-can" />
        </Button>
      </div>
    </div>
  )
}
