import { Task } from "@/entities/task/type"

import { sdate } from "@/shared/lib/date/lib"

import { Cell } from "./type"

export function generateCalendar(year = sdate().year, month = sdate().month) {
  const dates = []
  const firstDayOfMonth = sdate(new Date(year, month)).day

  let current = -firstDayOfMonth + 1
  for (let i = 0; i < 5; i++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      week.push(sdate(new Date(year, month, current++)))
    }
    dates.push(week)
  }
  return dates
}

export const processTasks = (tasks: Task[]) => {
  const mapTasks = new Map<number, Cell>()
  if (!tasks) return mapTasks
  // Group tasks by start_date or due_date
  const f = tasks.reduce((acc, task) => {
    const keydate = task.start_date || task.due_date
    if (!keydate) return acc
    const startDate = keydate.startDate().toUnix()
    if (!acc.has(startDate)) acc.set(startDate, [])
    acc.get(startDate)?.push(task)
    return acc
  }, new Map<number, Task[]>())

  //* sort tasks by due_date within each group, so that tasks with greater due dates appear first
  f.forEach((tasks, key) =>
    f.set(
      key,
      tasks.sort(({ due_date: a }, { due_date: b }) => {
        if (!a) return 1
        if (!b) return -1
        return (a.day || 0) - (b.day || 0)
      }),
    ),
  )

  //* calculate stubs for tasks
  let stub = 0
  f.forEach((tasks, key) => {
    const date = sdate().unixToDate(key)
    const day = date.day
    for (let i = 0; i < day; i++) {
      const unix = date.setDay(i).toUnix()
      if (!f.has(unix)) continue
      const existingTasks = f.get(unix) || []
      existingTasks.forEach((task) => {
        const isOverlap =
          task.start_date?.isBefore(date) &&
          task.due_date?.startDate().isSameOrAfter(date)
        if (isOverlap) stub += 1
      })
    }

    tasks.forEach((task) => {
      const keydate = task.start_date || task.due_date
      if (!keydate) return
      if (!task.start_date || !task.due_date) {
        const startUnix = keydate.toUnix()
        const existing = mapTasks.get(startUnix)?.tasks || []
        mapTasks.set(startUnix, {
          tasks: existing.concat({ task, range: 1 }),
          stub,
        })
        return
      }
      let savedStub = stub
      const startDate = task.start_date.startDate()
      const dueDate = task.due_date.startDate()
      const totalDays = startDate.rangeInDays(dueDate) + 1

      let remainingDays = totalDays
      let currentDate = startDate

      while (remainingDays > 0) {
        const daysToEndWeek = 7 - currentDate.day
        const daysInThisWeek = Math.min(remainingDays, daysToEndWeek)
        const currentUnix = currentDate.toUnix()
        const existing = mapTasks.get(currentUnix)?.tasks || []
        mapTasks.set(currentUnix, {
          tasks: existing.concat({ task, range: daysInThisWeek }),
          stub: savedStub,
        })

        currentDate = currentDate.setDay(0).addWeek(1)
        remainingDays -= daysInThisWeek
        savedStub = 0
      }
    })
    stub = 0
  })

  return mapTasks
}
