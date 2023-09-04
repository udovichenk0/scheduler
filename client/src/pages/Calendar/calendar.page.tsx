import { useState } from "react"
import dayjs from "dayjs"
import { useUnit } from "effector-react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { generateCalendar } from "@/shared/lib/generate-calendar"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"

import {
  $$createTask,
  $$deleteTask,
  $$modal,
  $$updateTask,
  $createdTask,
  $mappedTasks,
  $updatedTask,
  canceled,
  createTaskModalOpened,
  saved,
  updateTaskModalOpened,
} from "./calendar.model"
import { MonthSwitcher } from "./ui/month-switcher"
import { WeekNames } from "./ui/week-names"
import { CalendarTable } from "./ui/calendar-table/calendar-table"

const fullNameMonths = [
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
export const Calendar = () => {
  const [calendar, setCalendar] = useState(generateCalendar())
  const [date, setDate] = useState(dayjs())
  const changeMonth = (month: number) => {
    setDate(dayjs().month(month))
    setCalendar(generateCalendar(month))
  }
  const [tasks, openTaskCreating, openTaskUpdating, updatedTask, createdTask] =
    useUnit([
      $mappedTasks,
      createTaskModalOpened,
      updateTaskModalOpened,
      $updatedTask,
      $createdTask,
    ])
  const displayedMonth = date.month()
  const displayedYear = date.year()
  return (
    <Layout>
      <Layout.Header
        iconName="common/calendar"
        title={`Calendar, ${fullNameMonths[displayedMonth]} ${displayedYear}`}
      />
      <Layout.Content className="flex h-full flex-col">
        <MonthSwitcher
          displayedMonth={date.month()}
          changeMonth={changeMonth}
        />
        <WeekNames />
        <CalendarTable
          updateTaskOpened={openTaskUpdating}
          createTaskOpened={openTaskCreating}
          calendar={calendar}
          tasks={tasks}
        />
        <BaseModal className="w-[600px]" modal={$$modal}>
          {updatedTask?.id && (
            <ExpandedTask
              modifyTaskModel={$$updateTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={<UpdateActionsButtons taskId={updatedTask?.id} />}
            />
          )}
          {createdTask && (
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={<ActionsButton />}
            />
          )}
        </BaseModal>
      </Layout.Content>
    </Layout>
  )
}

const UpdateActionsButtons = ({ taskId }: { taskId: string }) => {
  const deleteTask = useUnit($$deleteTask.taskDeleted)
  return (
    <div className="flex items-center">
      <Button
        onClick={() => deleteTask({ id: taskId })}
        size={"xs"}
        className="mr-2"
        intent={"primary"}
      >
        <Icon
          name="common/trash-can"
          className="text-[24px] text-cIconDefault"
        />
      </Button>
      <ActionsButton />
    </div>
  )
}
const ActionsButton = () => {
  const [onCancel, onSave] = useUnit([canceled, saved])
  return (
    <div className="space-x-2">
      <Button onClick={onCancel} className="w-24 text-[12px]">
        Cancel
      </Button>
      <Button
        onClick={onSave}
        intent={"filled"}
        className="w-24 p-[1px] text-[12px]"
      >
        Save
      </Button>
    </div>
  )
}
