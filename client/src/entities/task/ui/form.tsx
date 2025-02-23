import { EventCallable, StoreWritable } from "effector"
import { useUnit } from "effector-react"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { onMount } from "@/shared/lib/react"

import { Modal } from "@/shared/ui/modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { getToday } from "@/shared/lib/date"
import { EditableContent } from "@/shared/ui/data-entry/editable-content"
import { TaskStatus as Status, TaskType as Type } from "../type"
import { formatTaskDate } from "../lib"
import { TaskStatus, TaskType } from "../model/task.model"

type TaskFactory = {
  $title: StoreWritable<string>
  $description: StoreWritable<Nullable<string>>
  $status: StoreWritable<Status>
  $type: StoreWritable<Type>
  $startDate: StoreWritable<Nullable<Date>>
  statusChanged: EventCallable<Status>
  descriptionChanged: EventCallable<Nullable<string>>
  titleChanged: EventCallable<string>
  typeChanged: EventCallable<Type>
  dateChanged: EventCallable<Date>
}

export const ModifyTaskForm = ({
  modifyTaskModel,
  dateModifier = true,
}: {
  modifyTaskModel: TaskFactory
  dateModifier?: boolean
}) => {
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>(null)
  const typePickerRef = useRef(null)

  const title = useUnit(modifyTaskModel.$title)
  const description = useUnit(modifyTaskModel.$description)
  const status = useUnit(modifyTaskModel.$status)
  const taskType = useUnit(modifyTaskModel.$type)
  const taskDate = useUnit(modifyTaskModel.$startDate)
  const [tempDate, setTempDate] = useState(taskDate)
  const onChangeStatus = useUnit(modifyTaskModel.statusChanged)
  const onChangeDescription = useUnit(modifyTaskModel.descriptionChanged)
  const onChangeTitle = useUnit(modifyTaskModel.titleChanged)
  const onChangeType = useUnit(modifyTaskModel.typeChanged)
  const onChangeDate = useUnit(modifyTaskModel.dateChanged)
  const changeDate = useCallback(() => {
    if(tempDate){
      onChangeDate(tempDate)
    }
  }, [tempDate])
  const {
    isOpened: isTypeModalOpened, 
    open: onOpenTypeModal, 
    close: onCloseTypeModal
  } = useDisclosure({ id: ModalName.TypeModal })

  const {
    isOpened: isDateModalOpened, 
    open: onOpenDateModal, 
    close: onCloseDateModal,
    cancel: onCancelDateModal
  } = useDisclosure({ id: ModalName.TaskFormDateModal, onClose: changeDate })

  onMount(() => inputRef.current?.focus())
  
  return (
    <div className="flex w-full gap-2 rounded-[5px] text-cTaskEditDefault">
      <Checkbox
        iconClassName="fill-cTaskEditDefault"
        checked={status == TaskStatus.FINISHED}
        onChange={() => onChangeStatus(status)}
      />
      <div className="ml-1 flex w-full flex-col gap-3">
        <input
          ref={inputRef}
          onChange={(e) => onChangeTitle(e.target.value)}
          value={title}
          placeholder={title ? "" : t("taskForm.newTask")}
          className="text-sm font-medium text-cFont outline-none"
        />
        <EditableContent aria-label="Add note" onSave={onChangeDescription} content={description || ""} placeholder="Note"/>
        <div className="space-y-1">
          <Button
            aria-label={`${taskType}: Choose type`}
            ref={typePickerRef}
            onClick={() => onOpenTypeModal()}
            size={"sm"}
            intent={"primary"}
            className="flex gap-4 text-sm"
          >
            <Icon
              name={"common/inbox"}
              className="size-[18px] text-accent"
            />
            {t(`task.${taskType}`)}
          </Button>

          {dateModifier && (
            <Button
              onClick={() => onOpenDateModal()}
              size={"sm"}
              intent={"primary"}
              className="flex"
            >
              <Icon
                name={"common/upcoming"}
                className="mr-4 size-[18px] text-cTaskEditDefault"
              />
              <span className="text-sm">{t("taskForm.date")}:</span>
              <span className="ml-2 text-accent text-sm">
                {taskDate && formatTaskDate(new Date(taskDate))}
              </span>
            </Button>
          )}
        </div>
        <Modal 
          label="Select event type" 
          isOpened={isTypeModalOpened} 
          closeModal={onCloseTypeModal}>
          <Modal.Overlay>
            <Modal.Body>
              <Modal.Content className="contents">
                <TypePicker 
                  currentType={taskType} 
                  changeType={(type) => {
                    onChangeType(type)
                    onCloseTypeModal()
                  }} 
                />
              </Modal.Content>
            </Modal.Body>
          </Modal.Overlay>
        </Modal>
        <Modal 
          label="Choose date" 
          isOpened={isDateModalOpened} 
          closeModal={onCloseDateModal}>
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
      </div>
    </div>
  )
}

const types = [
  { type: TaskType.INBOX, iconName: "common/inbox" },
  { type: TaskType.UNPLACED, iconName: "common/inbox" },
] as const

const TypePicker = ({
  currentType,
  changeType,
}: {
  currentType: "inbox" | "unplaced"
  changeType: (payload: "inbox" | "unplaced") => void
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="flex w-[280px] cursor-pointer flex-col gap-y-1 rounded-[5px] bg-main p-3">
      {types.map(({ type, iconName }, id) => {
        const active = type == currentType
        return (
          <Button
            key={id}
            size={"xs"}
            onClick={() => changeType(type)}
            className={`text-left ${
              active && "block w-full bg-cFocus"
            }`}
            intent={"primary"}
          >
            <Icon
              name={iconName}
              className={`mr-4 h-5 w-5 text-accent ${active && "text-hover"}`}
            />
            {t(`task.${type}`)}
          </Button>
        )
      })}
    </div>
  )
}
