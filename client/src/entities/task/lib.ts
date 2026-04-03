import { t } from "i18next"

import { Priority, TaskDto, TaskFields } from "@/shared/api/scheduler.schemas"
import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"

import { EditableTaskFields, Task, TaskId, Status, TaskDate } from "./type"
import { TaskPriority, TaskStatus } from "./model/task.model"
import { IconName } from "@/shared/ui/icon"

export function deleteById(tasks: Task[], deletedTaskId: TaskId) {
  return tasks.filter((task) => task.id != deletedTaskId)
}

export const isUnplaced = (task: Task) =>
  task.type == "unplaced" && (!!task.start_date || !!task.due_date)

export const isInbox = (task: Task) => task.type == "inbox"

export const taskToDomain = (taskDto: TaskDto): Task => {
  return {
    ...taskDto,
    start_date: taskDto.start_date ? sdate(taskDto.start_date) : null,
    due_date: taskDto.due_date ? sdate(taskDto.due_date) : null,
    date_created: sdate(taskDto.date_created),
  }
}

export const fieldsToDomain = (fields: TaskFields) => {
  return {
    start_date: fields.start_date ? sdate(fields.start_date) : null,
    due_date: fields.due_date ? sdate(fields.due_date) : null,
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
  priority,
}: Task): EditableTaskFields => {
  return {
    title,
    description,
    status,
    start_date,
    due_date,
    type,
    priority,
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

export function hasDate(date: { startDate: TaskDate; dueDate: TaskDate }) {
  return !!date.startDate || !!date.dueDate
}

export function getPriorityColor(priority: Priority) {
  switch (priority) {
    case TaskPriority.URGENT:
      return "red"
    case TaskPriority.HIGH:
      return "orange"
    case TaskPriority.NORMAL:
      return "blue"
    case TaskPriority.LOW:
      return "cFont"
    case TaskPriority.NONE:
      return "cOpacitySecondFont"
    default:
      console.log("Unknown priority: ", priority)
      return "cFont"
  }
}

export function getPriorityLabel(priority: Priority) {
  switch (priority) {
    case TaskPriority.URGENT:
      return "Urgent"
    case TaskPriority.HIGH:
      return "High"
    case TaskPriority.NORMAL:
      return "Normal"
    case TaskPriority.LOW:
      return "Low"
    default:
      return ""
  }
}

export function getIconNameByStatus(status: Status): IconName {
  switch (status) {
    case TaskStatus.TODO: {
      return "common/circle"
    }
    case TaskStatus.INPROGRESS: {
      return "common/loader"
    }
    case TaskStatus.FINISHED: {
      return "common/circle-done"
    }
  }
}
export function getStatusColor(status: Status) {
  switch (status) {
    case TaskStatus.TODO: {
      return "cOpacitySecondFont"
    }
    case TaskStatus.INPROGRESS: {
      return "purple"
    }
    case TaskStatus.FINISHED: {
      return "green"
    }
  }
}

export const getStatusLabel = (status: Status) => {
  switch (status) {
    case TaskStatus.TODO: {
      return "TO DO"
    }
    case TaskStatus.INPROGRESS: {
      return "IN PROGRESS"
    }
    case TaskStatus.FINISHED: {
      return "FINISHED"
    }
  }
}
