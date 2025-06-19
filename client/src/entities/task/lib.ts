import { t } from "i18next"

import { TaskDto } from "@/shared/api/scheduler.schemas"
import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"
import { unixToDate } from "@/shared/api/task/task.dto"

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

export const isUnplaced = (task: Task) =>
  task.type == "unplaced" && !!task.start_date

export const isInbox = (task: Task) => task.type == "inbox"

export const taskToDomain = (taskDto: TaskDto): Task => {
  return {
    ...taskDto,
    start_date: sdate(unixToDate(taskDto.start_date)),
    due_date: sdate(unixToDate(taskDto.due_date)),
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

export function formatTaskDate(date: SDate) {
  const currentDate = sdate()

  const time = date.hasTime ? date.format("h:mm a") : ""

  if (date.isSameDay(currentDate)) {
    return `${t("date.today")} ${time}`
  } else if (date.isTomorrow) {
    return `${t("date.tomorrow")} ${time}`
  } else if (date.isSameYear(currentDate)) {
    return `${t(SHORT_MONTHS_NAMES[date.month])} ${date.date} ${time}`
  } else {
    return `${date.format("MM/DD/YY")} ${time}`
  }
}
