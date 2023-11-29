import dayjs from "dayjs"
import { MouseEvent, useState } from "react"
import { Link } from "atomic-router-react"
import { t } from "i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { routes } from "@/shared/routing"
import { DatePicker } from "@/shared/ui/date-picker"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { TaskId, TaskStatus } from "@/shared/api/task"

import { Task } from "./type"
import { Modal } from "./ui/modal"

export const TaskItem = ({
  task,
  onUpdateStatus,
  onDoubleClick,
  dateLabel = false,
  onClick,
  isTaskSelected,
  onUpdateDate,
  typeLabel = false,
  taskRef,
}: {
  task: Task
  onUpdateDate: ({ date, id }: { date: Date; id: TaskId }) => void
  onUpdateStatus: ({ id, status }: { status: TaskStatus; id: TaskId }) => void
  onDoubleClick: () => void
  dateLabel?: boolean
  onClick: (e: MouseEvent) => void
  isTaskSelected: boolean
  typeLabel?: boolean
  taskRef?: React.RefObject<HTMLDivElement> | undefined
}) => {
  const { title, status, start_date } = task
  const [isDateOpened, setIsDateOpened] = useState(false)
  const onChangeDate = (date: Date) => {
    setIsDateOpened(false)
    onUpdateDate({ date, id: task.id })
  }
  const isSameDateOrAfter = dayjs(start_date).isSameOrAfter(dayjs())
  return (
    <div ref={taskRef} className="group flex gap-2">
      <Icon
        onClick={() => setIsDateOpened(true)}
        name="common/upcoming"
        className="invisible translate-y-1 text-lg text-accent group-hover:visible"
      />
      <Modal isOpened={isDateOpened} onClose={setIsDateOpened}>
        <DatePicker
          currentDate={task.start_date || new Date()}
          onDateChange={onChangeDate}
          onCancel={() => console.log("cancel")}
          onSave={() => console.log("cancel")}
        />
      </Modal>
      <Button
        id="task"
        intent={"primary"}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        className={`${
          isTaskSelected && "bg-cFocus"
        } flex w-full select-none items-center p-2 text-sm`}
      >
        <div id="task" className="flex w-full select-none gap-3">
          <Checkbox
            iconClassName="fill-cTaskEditDefault"
            onChange={() => onUpdateStatus({ id: task.id, status })}
            checked={status == "FINISHED"}
          />
          <div>
            <div className="flex">
              {dateLabel && start_date && !dayjs(start_date).isToday() && (
                <span
                  className={`mr-2 rounded-[5px] px-[5px] text-[12px] ${
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
                    className="mr-[6px] text-[9px] text-accent"
                  />
                )}
                <span
                  className={`text-sm font-medium ${
                    status == "FINISHED" && "text-grey line-through"
                  }`}
                >
                  {title}
                </span>
              </div>
            </div>
            <div>
              {typeLabel && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-[7px] w-[7px] rounded-full bg-accent"></span>
                  <Link
                    className="text-[12px] leading-3 text-grey hover:underline"
                    to={routes.unplaced}
                  >
                    {t("task.unplaced")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {task.description && (
          <Icon name="common/note" className="text-accent" />
        )}
      </Button>
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
