import dayjs, { Dayjs } from "dayjs"
import { t } from "i18next"

import { TaskDto } from "@/shared/api/scheduler.schemas"
import { unixToDate } from "@/shared/lib/date/unix-to-date"
import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { hasTimePart } from "@/shared/lib/date/has-time-part"

import { TaskStatuses } from "./config"
import { EditableTaskFields, Task, TaskId, Status } from "./type"

export const findTaskById = (tasks: Task[], id: TaskId) =>
  tasks.find((task) => task.id === id)!

export const changeTaskStatus = (status: Status) => {
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

export const taskToDomain = (taskDto: TaskDto): Task => {
  return {
    ...taskDto,
    start_date: unixToDate(taskDto.start_date),
    due_date: unixToDate(taskDto.due_date),
    date_created: new Date(taskDto.date_created),
  }
}

export const tasksToDomain = (tasksDto: TaskDto[]) => {
  return tasksDto.map(taskToDomain)
}

export const getTaskFields = ({
  title,
  description,
  status,
  start_date,
  type,
  due_date,
}: Task): EditableTaskFields => {
  return {
    title,
    description,
    status,
    start_date,
    due_date,
    type,
  }
}

export const shouldShowCompleted = (isToggled: boolean, task: Task) => {
  return task.status != "finished" || isToggled
}

export function formatTaskDate(date: Dayjs) {
  const hasTime = hasTimePart(date)
  const time = hasTime ? date.format("h:mm a") : ''
  if (date.isSame(dayjs(), "day")) {
    return `${t("date.today")} ${time}`
  } else if (date.isTomorrow()) {
    return `${t("date.tomorrow")} ${time}`
  } else if (date.isSame(dayjs(), "year")) {
    return `${t(SHORT_MONTHS_NAMES[date.month()])} ${date.date()} ${time}`
  } else {
    return `${date.format("MM/DD/YY")} ${time}`
  }
}
