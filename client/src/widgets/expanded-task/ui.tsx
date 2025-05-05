import { useUnit } from "effector-react"
import { ReactNode, RefObject, useEffect, useRef } from "react"
import { EventCallable, StoreWritable } from "effector"
import clsx from "clsx"

import { Status, Type } from "@/entities/task/type"
import { ModifyTaskForm } from "@/entities/task"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { Container } from "@/shared/ui/general/container"

type TaskFactory = {
  $title: StoreWritable<string>
  $description: StoreWritable<Nullable<string>>
  $status: StoreWritable<Status>
  $type: StoreWritable<Type>
  $startDate: StoreWritable<Nullable<Date>>
  $dueDate: StoreWritable<Nullable<Date>>
  statusChanged: EventCallable<Status>
  descriptionChanged: EventCallable<Nullable<string>>
  titleChanged: EventCallable<string>
  typeChanged: EventCallable<Type>
  dateChanged: EventCallable<{startDate: Nullable<Date>, dueDate: Nullable<Date>}>
}

export const ExpandedTask = ({
  isExpanded = true,
  dateModifier = true,
  modifyTaskModel,
  sideDatePicker = true,
  rightPanelSlot,
  className,
  closeTaskForm,
}: {
  isExpanded?: boolean
  taskRef?: RefObject<HTMLDivElement>
  dateModifier?: boolean
  modifyTaskModel: TaskFactory
  sideDatePicker?: boolean
  rightPanelSlot?: ReactNode
  className?: string
  closeTaskForm?: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const startDate = useUnit(modifyTaskModel.$startDate)
  const dueDate = useUnit(modifyTaskModel.$dueDate)
  const onChangeDate = useUnit(modifyTaskModel.dateChanged)


  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        closeTaskForm?.()
      }
    }
    if (isExpanded) {
      document.addEventListener("click", onClickOutside, true)
    }
    return () => {
      if (isExpanded) {
        document.removeEventListener("click", onClickOutside, true)
      }
    }
  }, [isExpanded])

  if (!isExpanded) {
    return null
  }

  return (
    <div ref={ref} className={clsx("group flex", className)}>
      {sideDatePicker && (
        <DatePicker
          CustomInput={({onClick}) => (
            <Button
              className="mr-2 size-5"
              intent="base"
              onClick={onClick}
            >
              <Icon
                name="common/upcoming"
                className="text-accent invisible translate-y-1 text-lg group-hover:visible"
              />
            </Button>
          )}
          startDate={startDate}
          dueDate={dueDate}
          onDateChange={onChangeDate} 
        />
      )}
      <Container className="bg-cTaskEdit w-full rounded-[5px]">
        <ModifyTaskForm
          dateModifier={dateModifier}
          modifyTaskModel={modifyTaskModel}
        />
        <div className="flex items-center justify-end mr-2">
          <DatePicker
            CustomInput={({onClick}) => (
              <Button
                intent="base"
                onClick={onClick}
              >
                <Icon
                  name="common/upcoming"
                  className="text-accent text-lg"
                />
              </Button>
            )}
            startDate={startDate}
            dueDate={dueDate}
            onDateChange={onChangeDate} 
          />
          {rightPanelSlot}
        </div>
      </Container>
    </div>
  )
}
