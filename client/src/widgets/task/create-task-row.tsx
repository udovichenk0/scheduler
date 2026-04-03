import { TaskCreator } from "@/features/manage-task/create"
import { Button } from "@/shared/ui/buttons/main-button"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Icon } from "@/shared/ui/icon"
import { RefObject, useRef, useState } from "react"
import { StatusIcon, StatusPopover } from "./status"
import { useUnit } from "effector-react"
import { ClickOutsideLayer } from "@/shared/lib/click-outside"
import { TaskTypePopover } from "./task-type-popover"
import { DatePopover } from "./date-popover"
import { PriorityPopover } from "./priority-popover"
import { defaultDateFormat } from "@/shared/lib/date/lib"
import { Priority } from "./priorities"

export const CreateTaskListItem = ({
  $$taskCreator,
  onCreateTaskToggle,
  clickedOnScroll,
  listId,
}: {
  $$taskCreator: TaskCreator
  onCreateTaskToggle: (b: boolean) => void
  clickedOnScroll: RefObject<boolean>
  listId: string
}) => {
  const changeStatus = useUnit($$taskCreator.statusChanged)
  const status = useUnit($$taskCreator.$status)
  const title = useUnit($$taskCreator.$title)
  const onChangeTitle = useUnit($$taskCreator.titleChanged)
  const startDate = useUnit($$taskCreator.$startDate)
  const dueDate = useUnit($$taskCreator.$dueDate)
  const onChangeDate = useUnit($$taskCreator.dateChanged)
  const priority = useUnit($$taskCreator.$priority)
  const isAllowToSubmit = useUnit($$taskCreator.$isAllowToSubmit)

  const onChangePriority = useUnit($$taskCreator.priorityChanged)
  const onCreateTask = useUnit($$taskCreator.createTaskTriggered)
  const onResetFields = useUnit($$taskCreator.resetFieldsTriggered)

  const [typeValue, setTypeValue] = useState("Task")
  const [isCreating, setIsCreating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  if (!isCreating) {
    return (
      <div className="border-b-cBorder hover:bg-hover flex h-9 w-full items-center gap-x-1 rounded-none border-b text-sm">
        <div className="min-w-75 bg-main sticky left-0 z-10 h-full w-full">
          <div className="text-cFont flex h-full items-center gap-x-1 px-4">
            <Icon
              className={buttonCva({ size: "sxs", intent: "base" })}
              name="common/plus"
            />
            <Button
              onClick={() => {
                setIsCreating(true)
                onCreateTaskToggle(true)
              }}
              size="xs"
              intent="filled"
              className="bg-hover"
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>
    )
  }
  const createTask = () => {
    onCreateTask({ listId })
  }
  return (
    <ClickOutsideLayer
      ref={ref}
      onClickOutside={function () {
        if (!ref.current) return
        if (!clickedOnScroll.current) {
          setIsCreating(false)
          onCreateTaskToggle(false)
          createTask()
          return
        }
        clickedOnScroll.current = false
      }}
    >
      <div
        className={
          "border-b-cBorder relative flex h-9 w-full items-center gap-x-1 rounded-none border-b text-sm"
        }
      >
        <div className="bg-main sticky left-0 z-10 flex h-full">
          <div className="text-cFont flex h-full items-center gap-x-1 px-4">
            <StatusPopover onChange={changeStatus}>
              <Button size="sxs">
                <StatusIcon status={status} />
              </Button>
            </StatusPopover>
            <input
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="bg-main sticky right-0 z-10 ml-auto flex h-full items-center gap-x-2 px-4">
          <TaskTypePopover onChange={setTypeValue}>
            <Button
              icon={{
                left: {
                  name: "common/circle-dot",
                  className: "text-cOpacitySecondFont text-sm",
                },
              }}
              intent="filled"
              size="xs"
              className="text-cOpacitySecondFont bg-main border-cBorder min-h-6 border text-xs font-medium"
            >
              {typeValue}
            </Button>
          </TaskTypePopover>
          <DatePopover
            startDate={startDate}
            dueDate={dueDate}
            onChange={onChangeDate}
          >
            <Button
              intent="filled"
              size="xs"
              icon={{
                left: {
                  className: "text-cOpacitySecondFont text-sm",
                  name: "common/calendar-due-date",
                },
              }}
              className="bg-main border-cBorder min-h-6 border text-xs font-medium"
            >
              {dueDate && defaultDateFormat(dueDate)}
            </Button>
          </DatePopover>
          <PriorityPopover
            priority={priority}
            onUpdate={(priority) => {
              onChangePriority(priority)
            }}
          >
            <Button
              intent="filled"
              size="xs"
              className="bg-main border-cBorder min-h-6 border text-xs font-medium"
            >
              <Priority priority={priority} />
              {/*<Icon
                className="text-cOpacitySecondFont text-sm"
                name="common/flag"
              />*/}
            </Button>
          </PriorityPopover>
          <div className="flex items-center gap-x-2">
            <Button
              size="sxs"
              className="border-cBorder min-h-6 border"
              intent="primary"
              onClick={() => {
                onResetFields()
                setIsCreating(false)
                onCreateTaskToggle(false)
              }}
            >
              Cancel
            </Button>
            <Button
              size="sxs"
              intent="filled"
              className="min-h-6"
              icon={{
                right: {
                  name: "common/cornder-down-left",
                },
              }}
              disabled={!isAllowToSubmit}
              onClick={() => {
                createTask()
                setIsCreating(false)
                onCreateTaskToggle(false)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </ClickOutsideLayer>
  )
}
