import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

import { DateModal } from "../modify/ui/date-modal"

import { Task, TaskStatus } from "./type"

export const TaskItem = ({
  task,
  onUpdateStatus,
  onDoubleClick,
  dateLabel = false,
  onClick,
  isTaskSelected,
  onUpdateDate,
}: {
  task: Task
  onUpdateDate: ({ date, id }: { date: Date; id: string }) => void
  onUpdateStatus: ({ id, status }: { id: string; status: TaskStatus }) => void
  onDoubleClick: () => void
  dateLabel?: boolean
  onClick: (task: Nullable<Task>) => void
  isTaskSelected: boolean
}) => {
  const [isDatePickerOpened, setDatePickerOpen] = useState(false)
  const { title, status, start_date } = task
  const onChangeDate = (date: Date) => {
    setDatePickerOpen(false)
    onUpdateDate({ date, id: task.id })
  }
  const onChangeStatus = () => {
    onUpdateStatus({ id: task.id, status })
  }
  useEffect(() => {
    return () => {
      onClick(null)
    }
  }, [])
  return (
    <div className="group flex gap-2">
      <Icon
        onClick={() => setDatePickerOpen(true)}
        name="common/upcoming"
        className="invisible translate-y-2 text-lg text-accent group-hover:visible"
      />
      {isDatePickerOpened && (
        <DateModal
          taskDate={task.start_date || new Date()}
          changeDate={onChangeDate}
          closeDatePicker={() => setDatePickerOpen(false)}
        />
      )}
      <Button
        intent={"primary"}
        onDoubleClick={onDoubleClick}
        onClick={() => onClick(task)}
        onBlur={() => onClick(null)}
        className={`${
          isTaskSelected && "bg-cFocus"
        } flex w-full select-none items-center px-2 py-2 text-sm`}
      >
        <div className="flex w-full select-none items-center">
          <Checkbox
            iconClassName="fill-cTaskEditDefault"
            onChange={onChangeStatus}
            checked={status == "FINISHED"}
          />
          {dateLabel && start_date && (
            <span
              className={`ml-2 rounded-[5px] px-[5px] text-[12px] ${
                dayjs(start_date).isSameOrAfter(dayjs())
                  ? "bg-cTimeInterval"
                  : "bg-cTimeIntervalLow"
              }`}
            >
              {normilizeDate(start_date)}
            </span>
          )}

          <span
            className={`ml-2 text-sm font-medium ${
              status == "FINISHED" && "text-grey line-through"
            }`}
          >
            {title}
          </span>
        </div>
        <Icon name="common/note" className="text-accent" />
      </Button>
    </div>
  )
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function normilizeDate(date: Date) {
  const dayjsDate = dayjs(date)
  if (dayjsDate.year() == dayjs().year()) {
    return `${months[dayjsDate.month()]} ${dayjsDate.date()}`
  } else {
    return `${dayjsDate.year()} ${
      months[dayjsDate.month()]
    } ${dayjsDate.date()}`
  }
}
