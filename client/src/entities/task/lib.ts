
import { EditableTaskFields, Task, TaskId, TaskStatus } from "./type"
import { TaskStatuses } from "./config"
import { dateToUnix } from "@/shared/lib/date/date-to-unix"
import { TaskDto } from '@/shared/api/scheduler.schemas'
import { unixToDate } from "@/shared/lib/date/unix-to-date"
import dayjs from "dayjs"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { t } from "i18next"

export const findTaskById = (tasks: Task[], id: TaskId) =>
  tasks.find((task) => task.id === id)!

export const changeTaskStatus = (status: TaskStatus) => {
  switch (true) {
    case status === TaskStatuses.FINISHED:
      return TaskStatuses.INPROGRESS
    case status === TaskStatuses.INPROGRESS:
      return TaskStatuses.FINISHED
    default:
      return TaskStatuses.INPROGRESS
  }
}

export function deleteById(tasks: Task[], deletedTaskId: TaskId) {
  return tasks.filter((task) => task.id != deletedTaskId)
}

export const isUnplaced = (task: Task) => task.type == "unplaced"

export const isInbox = (task: Task) => task.type == "inbox"

export const taskFieldsToDto = ({start_date, ...rest}: EditableTaskFields) => {
  return {
    ...rest,
    start_date: start_date ? dateToUnix(start_date) : null
  }
}

export const taskToDomain = (taskDto: TaskDto): Task => {
  return {
    ...taskDto,
    start_date: unixToDate(taskDto.start_date),
    date_created: new Date(taskDto.date_created)
  }
}

export const tasksToDomain = (tasksDto: TaskDto[]) => {
  return tasksDto.map(taskToDomain)
}

export const getTaskFields = ({title, description, status, start_date, type}: Task): EditableTaskFields => {
  return {
    title,
    description,
    status,
    start_date,
    type,
  }
}

export const shouldShowCompleted = (isToggled: boolean, task: Task) => {
  return task.status != 'finished' || isToggled
}

export function formatTaskDate(date: Date) {
  if (dayjs(date).isSame(dayjs(), "day")) {
    return t("date.today")
  } else if (dayjs(date).isTomorrow()) {
    return t("date.tomorrow")
  } else if (dayjs(date).isSame(dayjs(), "year")) {
    return `${t(LONG_MONTHS_NAMES[dayjs(date).month()])} ${dayjs(date).date()}`
  } else {
    return `${t(LONG_MONTHS_NAMES[dayjs(date).month()])} ${dayjs(
      date,
    ).date()} ${dayjs(date).year()}`
  }
}
