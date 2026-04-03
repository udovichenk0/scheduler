import { useUnit } from "effector-react"
import {
  KeyboardEvent,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react"
import clsx from "clsx"

import { Task } from "@/entities/task/type"
import { TaskUpdater } from "@/features/manage-task/update"
import { TaskPriority } from "@/entities/task/model/task.model"

import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { Dialog } from "@/shared/ui/disclosure/dialog"
import { Button } from "@/shared/ui/buttons/main-button"
import { DatePickerV2 } from "@/shared/ui/date-picker"
import { Icon, IconName } from "@/shared/ui/icon"
import { Popover } from "@/shared/ui/disclosure/popover"
import { StatusPopover } from "./status"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { defaultDateFormat } from "@/shared/lib/date/lib"
import { Priority } from "./priorities"
import { getStatusColor, getStatusLabel } from "@/entities/task/lib"
import { Editor } from "./editor"
import { TaskTypePopover } from "./task-type-popover"
import { PriorityPopover } from "./priority-popover"

const shouldIgnoreOpen = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest("button, a, input, textarea, [data-task-view-ignore=true]"),
  )
}

export const TaskView = ({
  task,
  children,
  $$taskUpdater,
  className,
}: {
  task: Task
  children: ReactNode
  $$taskUpdater: TaskUpdater
  className?: string
}) => {
  const onInitFields = useUnit($$taskUpdater.init)
  const onUpdateTask = useUnit($$taskUpdater.updateTaskTriggered)
  const onResetFields = useUnit($$taskUpdater.resetFieldsTriggered)

  const title = useUnit($$taskUpdater.$title)

  const onChangeTitle = useUnit($$taskUpdater.titleChanged)

  const { isOpened, open, close, cancel } = useDisclosure({
    id: ModalName.UpdateTaskFormById(task.id),
    onOpen: () => onInitFields(task),
    onClose: onUpdateTask,
    onCancel: onResetFields,
  })

  const onOpenModal = (target: EventTarget | null) => {
    if (shouldIgnoreOpen(target)) return
    open()
  }
  const triggerRef = useRef<HTMLDivElement>(null)

  const [typeValue, setTypeValue] = useState("Task")

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => onOpenModal(e.target)}
        ref={triggerRef}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onOpenModal(e.target)
          }
        }}
        className={clsx("h-full w-full", className)}
      >
        {children}
      </div>

      <Dialog
        focusAfterClose={triggerRef}
        label="Task details"
        isOpened={isOpened}
        closeDialog={close}
      >
        <Dialog.Content className="w-280 max-w-[95vw] p-7">
          <div className="flex flex-col gap-4">
            <Dialog.Header className="flex items-start justify-between gap-4">
              <div className="flex items-center">
                <TaskTypePopover onChange={setTypeValue}>
                  <Button
                    icon={{
                      left: { name: "common/circle-dot" },
                      right: {
                        name: "common/arrow",
                        className: "rotate-180 text-[10px]",
                      },
                    }}
                    intent="filled"
                    size="sxs"
                    className="text-cFont bg-main border-cBorder rounded-none rounded-l-sm border text-xs font-medium"
                  >
                    {typeValue}
                  </Button>
                </TaskTypePopover>
                <Button
                  intent="filled"
                  size="sxs"
                  className="bg-main border-cBorder rounded-none rounded-r-sm border text-xs"
                  onClick={async () => {
                    await navigator.clipboard.writeText(task.id)
                  }}
                >
                  {task.id}
                </Button>
              </div>
              <Dialog.CloseButton />
            </Dialog.Header>

            <div className="bg-main/60 rounded-lg">
              <input
                value={title}
                onChange={(e) => onChangeTitle(e.target.value)}
                placeholder="Task title"
                className={clsx(
                  buttonCva({ size: "sxs" }),
                  "cursor-auto! w-full text-lg font-semibold focus-visible:bg-transparent",
                )}
              />
              <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
                <StatusField $$taskUpdater={$$taskUpdater} />
                <AssigneesField />
                <DateField $$taskUpdater={$$taskUpdater} />
                <PriorityField $$taskUpdater={$$taskUpdater} />
              </div>
            </div>
            <Description $$taskUpdater={$$taskUpdater} />
            <div className="bg-main/60 rounded-lg">
              <div className="text-cOpacitySecondFont mb-3 text-xs">
                Add subtask
              </div>
              <Button size="sm" intent="primary">
                + New subtask
              </Button>
            </div>

            <div className="border-cBorder flex items-center justify-end gap-2 border-t pt-3">
              <Button size="sm" intent="primary" onClick={cancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={close}>
                Done
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}

const Description = ({ $$taskUpdater }: { $$taskUpdater: TaskUpdater }) => {
  const description = useUnit($$taskUpdater.$description)
  const onChangeDescription = useUnit($$taskUpdater.descriptionChanged)

  const [isDescriptionOpen, setDescriptionOpen] = useState(Boolean(description))
  return (
    <div className="bg-main/60 rounded-lg">
      {!isDescriptionOpen && (
        <Button size="sm" onClick={() => setDescriptionOpen(true)}>
          Add description
        </Button>
      )}
      {isDescriptionOpen && (
        <Editor onBlur={onChangeDescription} state={description} />
      )}
    </div>
  )
}

const TaskFieldRow = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid min-h-9 grid-cols-[130px_1fr] items-center gap-3 text-xs">
      {children}
    </div>
  )
}

const TaskFieldLabel = ({
  children,
  icon,
}: {
  children: ReactNode
  icon: IconName
}) => {
  return (
    <div className="flex items-center gap-x-1">
      {icon && <Icon className="text-cOpacitySecondFont text-sm" name={icon} />}
      <span className="text-cFont text-sm">{children}</span>
    </div>
  )
}

const StatusField = ({ $$taskUpdater }: { $$taskUpdater: TaskUpdater }) => {
  const status = useUnit($$taskUpdater.$status)
  const onChangeStatus = useUnit($$taskUpdater.statusChanged)

  const color = `var(--color-${getStatusColor(status)})`
  const label = getStatusLabel(status)

  return (
    <TaskFieldRow>
      <TaskFieldLabel icon="common/circle">Status</TaskFieldLabel>
      <StatusPopover onChange={onChangeStatus}>
        <Button className="h-full" size="sm">
          <span
            style={{ backgroundColor: color }}
            className={clsx("text-start", buttonCva({ size: "sxs" }))}
          >
            {label}
          </span>
        </Button>
      </StatusPopover>
    </TaskFieldRow>
  )
}

const AssigneesField = () => {
  return (
    <TaskFieldRow>
      <TaskFieldLabel icon="common/user">Assignees</TaskFieldLabel>
      <Empty isEmpty={true}>
        <div className="flex items-center gap-2">
          <Icon name="common/user-plus" className="size-3" />
          <span className="text-cOpacitySecondFont">Unassigned</span>
        </div>
      </Empty>
    </TaskFieldRow>
  )
}

const DateField = ({ $$taskUpdater }: { $$taskUpdater: TaskUpdater }) => {
  const startDate = useUnit($$taskUpdater.$startDate)
  const dueDate = useUnit($$taskUpdater.$dueDate)
  const onChangeDate = useUnit($$taskUpdater.dateChanged)
  const { isOpened, open, close, cancel } = useDisclosure({
    prefix: ModalName.DateModal,
  })

  return (
    <TaskFieldRow>
      <TaskFieldLabel icon="common/calendar">Date</TaskFieldLabel>
      <Popover label="Select task date" isOpened={isOpened} closeModal={close}>
        <Popover.Trigger
          asChild
          className={clsx(
            "flex h-full items-center gap-x-1 overflow-hidden",
            buttonCva({ size: "sm" }),
          )}
          onClick={open}
        >
          <div tabIndex={0}>
            <div className="flex items-center gap-x-1 whitespace-nowrap">
              {startDate ? (
                <>
                  <Icon name="common/calendar-start-date" />
                  <span className="text-cFont">
                    {defaultDateFormat(startDate)}
                  </span>
                </>
              ) : (
                <>
                  <Icon
                    className="text-cOpacitySecondFont"
                    name="common/calendar-start-date"
                  />
                  <span className="text-cOpacitySecondFont">Start</span>
                </>
              )}
              <Icon
                className="text-cOpacitySecondFont"
                name="common/arrow-right"
              />
            </div>
            {dueDate ? (
              <>
                <span className="flex items-center">
                  <Icon name="common/calendar-due-date" />
                </span>
                <span className="text-cFont overflow-hidden text-ellipsis whitespace-nowrap">
                  {defaultDateFormat(dueDate)}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center">
                  <Icon
                    className="text-cOpacitySecondFont"
                    name="common/calendar-due-date"
                  />
                </span>
                <span className="text-cOpacitySecondFont">Due</span>
              </>
            )}
          </div>
        </Popover.Trigger>
        <Popover.Content className="p-0! mt-2">
          <DatePickerV2
            startDate={startDate}
            dueDate={dueDate}
            onCancel={cancel}
            onDateChange={({ start, due }) => {
              onChangeDate({ startDate: start, dueDate: due })
              close()
            }}
          />
        </Popover.Content>
      </Popover>
    </TaskFieldRow>
  )
}

const PriorityField = ({ $$taskUpdater }: { $$taskUpdater: TaskUpdater }) => {
  const priority = useUnit($$taskUpdater.$priority)
  const onChangePriority = useUnit($$taskUpdater.priorityChanged)

  return (
    <TaskFieldRow>
      <TaskFieldLabel icon="common/flag">Priority</TaskFieldLabel>
      <PriorityPopover priority={priority} onUpdate={onChangePriority}>
        <div>
          <Empty isEmpty={priority == TaskPriority.NONE}>
            <Priority priority={priority} />
          </Empty>
        </div>
      </PriorityPopover>
    </TaskFieldRow>
  )
}

const Empty = ({
  children,
  isEmpty,
}: {
  children: ReactNode
  isEmpty: boolean
}) => {
  return (
    <Button size="sm" className={"flex h-full w-full items-center gap-x-2"}>
      {isEmpty && (
        <span className="text-cOpacitySecondFont text-sm">Empty</span>
      )}
      {!isEmpty && <>{children}</>}
    </Button>
  )
}
