import { useUnit } from "effector-react"
import { ReactNode, RefObject, useEffect, useRef, useState } from "react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { EventCallable, StoreWritable } from "effector"
import { Container } from "@/shared/ui/general/container"
import { Modal } from "@/shared/ui/modal"
import clsx from "clsx"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { getToday } from "@/shared/lib/date"
import { TaskStatus, TaskType } from "@/entities/task/type"
import { ModifyTaskForm } from "@/entities/task"

type TaskFactory = {
  $title: StoreWritable<string>
  $description: StoreWritable<Nullable<string>>
  $status: StoreWritable<TaskStatus>
  $type: StoreWritable<TaskType>
  $startDate: StoreWritable<Nullable<Date>>
  statusChanged: EventCallable<TaskStatus>
  descriptionChanged: EventCallable<Nullable<string>>
  titleChanged: EventCallable<string>
  typeChanged: EventCallable<TaskType>
  dateChanged: EventCallable<Date>
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
  isExpanded?: boolean,
  taskRef?: RefObject<HTMLDivElement>
  dateModifier?: boolean
  modifyTaskModel: TaskFactory
  sideDatePicker?: boolean
  rightPanelSlot?: ReactNode
  className?: string,
  closeTaskForm?: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const taskDate = useUnit(modifyTaskModel.$startDate)
  const [tempDate, setTempDate] = useState(taskDate)
  const changeDate = useUnit(modifyTaskModel.dateChanged)

  const onChangeDate = () => {
    if(tempDate){
      changeDate(tempDate)
    }
  }
  const {
    isOpened: isDateModalOpened, 
    open: onOpenDateModal, 
    close: onCloseDateModal,
    cancel: onCancelDateModal
  } = useDisclosure({ id: ModalName.DateModal, onClose: onChangeDate })


  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        closeTaskForm?.()
      }
    }
    if(isExpanded){
      document.addEventListener("click", onClickOutside, true)
    }
    return () => {
      if(isExpanded){
        document.removeEventListener("click", onClickOutside, true)
      }
    }
  }, [isExpanded])

  if(!isExpanded){
    return null
  }

  return (
    <div ref={ref} className={clsx("group flex", className)}>
      <Modal 
        label="Choose date" 
        isOpened={isDateModalOpened} 
        closeModal={onCloseDateModal}>
          {sideDatePicker && (
            <Modal.Trigger className="size-5 mr-2" intent="base" onClick={onOpenDateModal}>
              <Icon
                name="common/upcoming"
                className="invisible translate-y-1 text-lg text-accent group-hover:visible"
              />
            </Modal.Trigger>
          )}
        <Modal.Overlay>
          <Modal.Body>
            <Modal.Content>
              <DatePicker
                currentDate={tempDate || getToday()}
                onDateChange={setTempDate}
                onCancel={() => {
                  onCancelDateModal()
                  setTempDate(taskDate)
                }}
                onSave={onCloseDateModal}
              />
            </Modal.Content>
          </Modal.Body>
        </Modal.Overlay>
      </Modal>
        <Container className="rounded-[5px] w-full bg-cTaskEdit">
          <ModifyTaskForm
            dateModifier={dateModifier}
            modifyTaskModel={modifyTaskModel}
          />
          <div className="flex items-center justify-end space-x-1">
            <Button aria-label="Choose date" onClick={onOpenDateModal} intent={"primary"} size={"xs"}>
              <Icon
                name="common/upcoming"
                className="p-[3px] text-[19px] text-cIconDefault"
              />
            </Button>
            {rightPanelSlot}
          </div>
        </Container>
    </div>
  )
}
