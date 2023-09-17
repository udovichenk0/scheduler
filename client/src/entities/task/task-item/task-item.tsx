import dayjs from "dayjs"
import { useEffect } from "react"
import { Link } from "atomic-router-react"
import { t } from "i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { routes } from "@/shared/routing"
import { BaseModal } from "@/shared/ui/modals/base"
import { DatePicker } from "@/shared/ui/date-picker"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { TaskId, TaskStatus } from "@/shared/api/task"

import { Task } from "./type"

import { $$dateModal } from "."

export const TaskItem = ({
  task,
  onUpdateStatus,
  onDoubleClick,
  dateLabel = false,
  onClick,
  isTaskSelected,
  onUpdateDate,
  typeLabel = false,
}: {
  task: Task
  onUpdateDate: ({ date, id }: { date: Date; id: TaskId }) => void
  onUpdateStatus: ({ id, status }: { status: TaskStatus; id: TaskId }) => void
  onDoubleClick: () => void
  dateLabel?: boolean
  onClick: (task: Nullable<TaskId>) => void
  isTaskSelected: boolean
  typeLabel?: boolean
}) => {
  const { title, status, start_date } = task
  const onChangeDate = (date: Date) => {
    $$dateModal.close()
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
        onClick={() => $$dateModal.open()}
        name="common/upcoming"
        className="invisible translate-y-1 text-lg text-accent group-hover:visible"
      />
      <BaseModal modal={$$dateModal}>
        <DatePicker
          currentDate={task.start_date || new Date()}
          onDateChange={onChangeDate}
          onCancel={() => console.log("cancel")}
          onSave={() => console.log("cancel")}
        />
      </BaseModal>
      <Button
        intent={"primary"}
        onDoubleClick={onDoubleClick}
        onClick={() => onClick(task.id)}
        onBlur={() => onClick(null)}
        className={`${
          isTaskSelected && "bg-cFocus"
        } flex w-full select-none items-center p-2 text-sm`}
      >
        <div className="flex w-full select-none gap-3">
          <Checkbox
            iconClassName="fill-cTaskEditDefault"
            onChange={onChangeStatus}
            checked={status == "FINISHED"}
          />
          <div>
            <div className="flex">
              {dateLabel && start_date && !dayjs(start_date).isToday() && (
                <span
                  className={`mr-2 rounded-[5px] px-[5px] text-[12px] ${
                    dayjs(start_date).isSameOrAfter(dayjs())
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
