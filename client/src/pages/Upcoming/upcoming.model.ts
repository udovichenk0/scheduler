import { combine, createEvent, createStore, sample } from "effector"
import { not } from "patronum"
import dayjs, { Dayjs } from "dayjs"
import { createContext } from "react"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $$task, Task } from "@/entities/task/task-item"
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$deleteTask = createRemoveTaskFactory()
export const FactoriesContext = createContext({
  $$updateTask,
  $$createTask,
  $$taskDisclosure,
})

export const $nextDate = createStore(new Date())
export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()

export const variantSelected = createEvent<"upcoming" | Dayjs>()
export const $variant = createStore<"upcoming" | Dayjs>("upcoming").on(
  variantSelected,
  (_, variant) => variant,
)

export const $tasksByDate = combine($$task.$taskKv, $variant, (kv, variant) => {
  return Object.values(kv).filter(({ start_date }) => {
    return (
      variant != "upcoming" &&
      dayjs(start_date).startOf("date").isSame(variant.startOf("date"))
    )
  })
})

export const $tasksByDateKv = combine($$task.$taskKv, (kv) => {
  return Object.values(kv).reduce(
    (acc, item) => {
      const date = dayjs(item.start_date).format("YYYY-MM-DD")
      if (!item.start_date) {
        return acc
      }
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
  clock: $$createTask.taskSuccessfullyCreated,
  source: $nextDate,
  target: $selectedDate,
})
sample({
  clock: currentDateSelected,
  filter: $$createTask.$isAllowToSubmit,
})
sample({
  clock: currentDateSelected,
  target: $nextDate,
})
sample({
  clock: $$createTask.taskSuccessfullyCreated,
  source: $selectedDate,
  target: $$createTask.dateChanged,
})
