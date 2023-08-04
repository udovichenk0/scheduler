import dayjs from "dayjs"
import { useEffect } from "react"

import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"

import { Task } from "./type"

export const TaskItem = ({
  data,
  onChangeCheckbox,
  onDoubleClick,
  date = false,
  onClick,
  isTaskSelected,
}: {
  data: Task
  onChangeCheckbox: () => void
  onDoubleClick: () => void
  date?: boolean
  onClick: (task: Nullable<Task>) => void
  isTaskSelected: boolean
}) => {
  const { title, status, start_date } = data
  useEffect(() => {
    return () => {
      onClick(null)
    }
  }, [])
  return (
    <Button
      intent={"primary"}
      onDoubleClick={onDoubleClick}
      onClick={() => onClick(data)}
      onBlur={() => onClick(null)}
      className={`${
        isTaskSelected && "bg-cFocus"
      } flex w-full select-none items-center px-2 py-2 text-sm`}
    >
      <Checkbox onChange={onChangeCheckbox} checked={status == "FINISHED"} />
      {date && start_date && (
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
    </Button>
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
