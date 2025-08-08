import { useUnit } from "effector-react"
import { ReactNode, RefObject, useEffect } from "react"
import clsx from "clsx"

import { ModifyTaskForm } from "@/entities/task/ui/form.tsx"
import { PriorityPicker } from "@/entities/task/ui/priority-picker"
import { TaskEditor } from "@/entities/task/model/modify.model"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { Container } from "@/shared/ui/general/container"
import { isEsc } from "@/shared/lib/key-utils"
import { ClickOutsideLayer } from "@/shared/lib/click-outside"

export const ExpandedTask = ({
  isExpanded = true,
  dateModifier = true,
  $$taskManager,
  sideDatePicker = true,
  rightPanelSlot,
  className,
  closeTaskForm,
}: {
  isExpanded?: boolean
  taskRef?: RefObject<HTMLDivElement>
  dateModifier?: boolean
  $$taskManager: TaskEditor
  sideDatePicker?: boolean
  rightPanelSlot?: ReactNode
  className?: string
  closeTaskForm?: () => void
}) => {
  const startDate = useUnit($$taskManager.$startDate)
  const dueDate = useUnit($$taskManager.$dueDate)
  const priority = useUnit($$taskManager.$priority)

  const onChangeDate = useUnit($$taskManager.dateChanged)
  const onChangePriority = useUnit($$taskManager.priorityChanged)

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
          modifyTaskModel={$$taskManager}
        />
        <div className="flex items-center justify-end space-x-2">
          <PriorityPicker priority={priority} onUpdate={onChangePriority} />
          <DatePicker
            CustomInput={({ onClick }) => (
              <Button
                className="flex items-center justify-center"
                intent="base"
                onClick={onClick}
              >
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
