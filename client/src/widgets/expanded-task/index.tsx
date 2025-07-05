import { useUnit } from "effector-react"
import { ReactNode, RefObject, useEffect } from "react"
import { EventCallable, StoreWritable } from "effector"
import clsx from "clsx"

import { Priority, Status, Type } from "@/entities/task/type"
import { ModifyTaskForm } from "@/entities/task/ui/form.tsx"
import { PriorityPicker } from "@/entities/task/ui/priority-picker"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { Container } from "@/shared/ui/general/container"
import { SDate } from "@/shared/lib/date/lib"
import { isEsc } from "@/shared/lib/key-utils"
import { ClickOutsideLayer } from "@/shared/lib/click-outside"

type TaskFactory = {
  $title: StoreWritable<string>
  $description: StoreWritable<Nullable<string>>
  $status: StoreWritable<Status>
  $type: StoreWritable<Type>
  $startDate: StoreWritable<Nullable<SDate>>
  $dueDate: StoreWritable<Nullable<SDate>>
  $priority: StoreWritable<Priority>
  statusChanged: EventCallable<Status>
  descriptionChanged: EventCallable<Nullable<string>>
  titleChanged: EventCallable<string>
  typeChanged: EventCallable<Type>
  dateChanged: EventCallable<{
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }>
  priorityChanged: EventCallable<Priority>
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
  const startDate = useUnit(modifyTaskModel.$startDate)
  const dueDate = useUnit(modifyTaskModel.$dueDate)
  const priority = useUnit(modifyTaskModel.$priority)

  const onChangeDate = useUnit(modifyTaskModel.dateChanged)
  const onChangePriority = useUnit(modifyTaskModel.priorityChanged)

  useEffect(() => {
    const onEscDown = (e: KeyboardEvent) => {
      if (isEsc(e)) {
        closeTaskForm?.()
      }
    }
    if (isExpanded) {
      document.addEventListener("keydown", onEscDown)
    }

    return () => {
      if (isExpanded) {
        document.removeEventListener("keydown", onEscDown)
      }
    }
  }, [isExpanded])

  if (!isExpanded) {
    return null
  }

  return (
    <ClickOutsideLayer
      onClickOutside={() => closeTaskForm?.()}
      className={clsx("group flex", className)}
    >
      {sideDatePicker && (
        <DatePicker
          CustomInput={({ onClick }) => (
            <Button className="mr-2 size-5" intent="base" onClick={onClick}>
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
        <div className="mr-2 flex items-center justify-end">
          <PriorityPicker priority={priority} onUpdate={onChangePriority} />
          <DatePicker
            CustomInput={({ onClick }) => (
              <Button intent="base" onClick={onClick}>
                <Icon name="common/upcoming" className="text-accent text-lg" />
              </Button>
            )}
            startDate={startDate}
            dueDate={dueDate}
            onDateChange={onChangeDate}
          />
          {rightPanelSlot}
        </div>
      </Container>
    </ClickOutsideLayer>
  )
}
