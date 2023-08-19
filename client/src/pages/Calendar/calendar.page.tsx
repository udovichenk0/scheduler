import { ReactNode, useRef, useState, MouseEvent } from "react"
import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { createPortal } from "react-dom"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { generateCalendar } from "@/shared/lib/generate-calendar"
import { ModalType } from "@/shared/lib/modal"
import { Button } from "@/shared/ui/buttons/main-button"

import {
  $$createTask,
  $$modal,
  $$taskDisclosure,
  $$updateTask,
  $mappedTasks,
  canceled,
  createTaskModalOpened,
  saved,
  updateTaskModalOpened,
} from "./calendar.model"
import { MonthSwitcher } from "./ui/month-switcher"
import { WeekNames } from "./ui/week-names"
import { CalendarTable } from "./ui/calendar-table"
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
  const [tasks, openTaskCreating, openTaskUpdating, newTask] = useUnit([
    $mappedTasks,
    createTaskModalOpened,
    updateTaskModalOpened,
    $$taskDisclosure.$newTask,
    $$taskDisclosure.$taskId,
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
        <ModifyTaskFormModal modal={$$modal}>
          <ExpandedTask
            modifyTaskModel={newTask ? $$createTask : $$updateTask}
            dateModifier={true}
            sideDatePicker={false}
            rightPanelSlot={<ActionsButtons/>}
          />
        </ModifyTaskFormModal>
      </Layout.Content>
    </Layout>
  )
}

const ActionsButtons = () => {
  const [onCancel, onSave] = useUnit([canceled, saved])
  return (
    <div className="flex gap-3 text-primary">
      <Button
        onClick={onCancel}
        className="w-24 p-[1px] text-[12px]"
      >
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

const ModifyTaskFormModal = ({ 
  modal, 
  children
}: { 
    modal: ModalType;
    children: ReactNode
  }) => {
  const [clickOutsideTriggered, isOpened] = useUnit([
    saved,
    modal.$isOpened,
  ])
  const ref = useRef<HTMLDivElement>(null)
  if (!isOpened) {
    return null
  }
  const handleOnClickOutside = (e: MouseEvent) => {
    if (e.target === ref.current) {
      clickOutsideTriggered()
    }
    e.stopPropagation()
  }
  return createPortal(
    <div
      ref={ref}
      onClick={handleOnClickOutside}
      className="absolute left-0 top-0 z-[999] flex h-screen w-full items-center justify-center bg-black/40 text-primary"
    >
      <div
        className={"w-[600px] rounded-[5px] border-[1px] border-cBorder bg-main drop-shadow-base"}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
