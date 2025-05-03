import dayjs from "dayjs"
import { Ref, useRef } from "react"
import { Link } from "atomic-router-react"
import { t } from "i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { routes } from "@/shared/routing"
import { DatePicker } from "@/shared/ui/date-picker"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { Modal } from "@/shared/ui/modal"

import { TaskStatuses } from "../config"
import { Task, TaskId, Status, Type } from "../type"

export const TaskItem = ({
  ref: elem,
  isShown,
  task,
  onUpdateStatus,
  onDoubleClick,
  dateLabel = false,
  onSelect,
  onBlur,
  onUpdateDate,
  typeLabel = false,
}: {
  ref: Ref<HTMLButtonElement>
  isShown: boolean
  task: Task
  onUpdateDate?: ({
    startDate,
    dueDate,
    id,
  }: {
    startDate: Nullable<Date>
    dueDate: Nullable<Date>
    id: TaskId
  }) => void
  onUpdateStatus?: ({ id, status }: { status: Status; id: TaskId }) => void
  onDoubleClick?: () => void
  dateLabel?: boolean
  onSelect: () => void
  onBlur: (el: Element) => void
  typeLabel?: boolean
}) => {
  const { title, status, start_date, due_date } = task

  const isSameDateOrAfter = dayjs(start_date).isSameOrAfter(dayjs())

  if (!isShown) {
    return null
  }

  return (
    <div className="group flex">
      <DatePicker
        dueDate={due_date}
        CustomInput={({ onClick }) => {
          return (
            <div className="mr-2 w-5">
              {onUpdateDate && (
                <Modal.Trigger
                  className="size-5"
                  intent="base"
                  onClick={onClick}
                >
                  <Icon
                    data-testid="task-date-button"
                    name="common/upcoming"
                    className="text-accent invisible translate-y-1 text-lg group-hover:visible"
                  />
                </Modal.Trigger>
              )}
            </div>
          )
        }}
        onDateChange={({startDate, dueDate}) => {
          onUpdateDate?.({startDate, dueDate, id: task.id})
        }}
        startDate={start_date}
      />
      <Button
        aria-label={`Event ${title}`}
        onClick={(e) => {
          if (!e.detail && onDoubleClick) {
            onDoubleClick()
          }
          if (e.detail) {
            onSelect()
          }
        }}
        onBlur={(e) => {
          const t = e.relatedTarget as Element
          onBlur(t)
        }}
        data-testid="task-item"
        id="task"
        intent={"primary"}
        ref={elem}
        className={`task focus:bg-cFocus flex w-full items-center px-2 text-sm transition-none`}
      >
        <div id="task" className="flex h-full w-full items-center gap-3">
          <Checkbox
            disabled={!onUpdateStatus}
            iconClassName="fill-cTaskEditDefault"
            onChange={() => onUpdateStatus?.({ id: task.id, status })}
            checked={status == TaskStatuses.FINISHED}
          />
          <div className="h-full w-full py-2" onDoubleClick={onDoubleClick}>
            <div className="flex">
              {dateLabel && start_date && !dayjs(start_date).isToday() && (
                <span
                  className={`mr-2 rounded-[5px] px-[5px] text-xs ${
                    isSameDateOrAfter
                      ? "bg-cTimeInterval"
                      : "bg-cTimeIntervalLow"
                  }`}
                >
                  {normilizeDate(start_date)}
                </span>
              )}
              <div className="flex items-center">
                {dayjs(start_date).isToday() && (
                  <Icon
                    name="common/filled-star"
                    className="text-accent mr-[6px] text-[9px]"
                  />
                )}
                <h3
                  className={`text-sm font-medium ${
                    status == TaskStatuses.FINISHED &&
                    "text-cOpacitySecondFont line-through"
                  }`}
                >
                  {title}
                </h3>
              </div>
            </div>
            <TypeLable isVisible={typeLabel} taskType={task.type} />
          </div>
        </div>
        {task.description && (
          <Icon name="common/note" className="text-accent" />
        )}
      </Button>
    </div>
  )
}

const TypeLable = ({
  isVisible,
  taskType,
}: {
  isVisible: boolean
  taskType: Type
}) => {
  const ref = useRef<HTMLDivElement>(null)
  if (!isVisible) {
    return null
  }
  return (
    <div ref={ref} className="mt-1 flex items-center gap-2">
      <span className="bg-accent size-2 rounded-full"></span>
      <Link
        onKeyDown={(e) => e.stopPropagation()}
        className="text-cOpacitySecondFont text-xs leading-3 hover:underline"
        to={routes[taskType]}
      >
        {t(`task.${taskType}`)}
      </Link>
    </div>
  )
}

function normilizeDate(date: Date) {
  const dayjsDate = dayjs(date)
  if (dayjsDate.year() == dayjs().year()) {
    return `${t(LONG_MONTHS_NAMES[dayjsDate.month()])} ${dayjsDate.date()}`
  } else {
    return `${dayjsDate.year()} ${t(
      LONG_MONTHS_NAMES[dayjsDate.month()],
    )} ${dayjsDate.date()}`
  }
}
