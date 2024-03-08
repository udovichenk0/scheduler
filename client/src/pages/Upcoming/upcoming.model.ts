import { combine, createEvent, sample, createStore } from "effector"
import { not, spread } from "patronum"
import dayjs, { Dayjs } from "dayjs"
import { createContext } from "react"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, Task, createSorting } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"
import { selectTaskFactory } from "@/shared/lib/effector"

import { getTasksPerDate, getTasksForRemainingMonth, getTasksPerMonth, getTasksForRemainingYear, getTasksPerYear } from "./lib"
type Variant = "upcoming" | Dayjs

//factories
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: dayjs(new Date()).startOf('date').toDate(),
})
export const $$taskDisclosure = disclosureTask({
  $tasks: $$task.$tasks,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$trashTask = trashTaskFactory()
export const $$sort = createSorting()


export const TaskManagerContext = createContext({
  $$updateTask,
  $$createTask,
  $$taskDisclosure,
})

export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()

export const variantSelected = createEvent<Variant>()
export const $variant = createStore<Variant>("upcoming").on(
  variantSelected,
  (_, variant) => variant,
)

const $sortedTasks = combine($$task.$tasks, $$sort.$sortType, (tasks, sortType) => {
  if (!tasks) return []
  const upcomingTasks = tasks.filter(({ is_deleted }) => !is_deleted)
  return $$sort.sortBy(sortType, upcomingTasks)
})
export const $upcomingTasks = combine($sortedTasks, $variant, (tasks, variant) => {
  if (variant == "upcoming" && tasks) {
    const first = getTasksPerDate(tasks)
    const second = getTasksForRemainingMonth(tasks)
    const third = getTasksPerMonth(tasks)
    const fourth = getTasksForRemainingYear(tasks)
    const fifth = getTasksPerYear(tasks)
    return first.concat(second, third, fourth, fifth)
  }
  return []
})

export const $tasksByDate = combine($sortedTasks, $variant, (tasks, variant) => {
  if (variant != "upcoming" && tasks) {
    return tasks.filter(({ start_date }) => {
      return dayjs(start_date).startOf("date").isSame(variant.startOf("date"))
    })
  }
  return []
})


export const selectTaskIdWithSectionTitle = createEvent<{taskId: TaskId, section: string}>()
const $selectedSection = createStore<Nullable<string>>(null)

const $tasks = combine($upcomingTasks, $tasksByDate, $selectedSection, $variant, 
  (upcomingTasks, tasksByDate, selectedUpcomingSection, variant) => {
    if(variant == 'upcoming'){
      const a = upcomingTasks.find(task => task.title == selectedUpcomingSection)?.tasks!
      return a ?? []
    } else {
      return tasksByDate
    }
})
export const $$selectTask = selectTaskFactory($tasks)

sample({
  clock: selectTaskIdWithSectionTitle,
  target: spread({
    taskId: $$selectTask.selectTaskId,
    section: $selectedSection
  })
})

export const $tasksByDateKv = combine($$task.$tasks, (tasks) => {
  if (!tasks) return null
  return tasks.reduce(
    (acc, item) => {
      const date = dayjs(item.start_date).format("YYYY-MM-DD")
      if (!item.start_date) return acc
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as unknown as Record<string, Task[]>,
  )
})

sample({
  clock: currentDateSelected,
  filter: not($$createTask.$isAllowToSubmit),
  target: [$$createTask.dateChanged, $selectedDate],
})

sample({
  clock: currentDateSelected,
  filter: $$createTask.$isAllowToSubmit,
})

sample({
  clock: $$createTask.taskSuccessfullyCreated,
  source: $selectedDate,
  target: $$createTask.dateChanged,
})

sample({
  clock: variantSelected,
  fn: (variant) => {
    if (variant == "upcoming") {
      return dayjs(new Date()).startOf('date').toDate()
    }
    return variant.toDate()
  },
  target: $selectedDate,
})
sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})