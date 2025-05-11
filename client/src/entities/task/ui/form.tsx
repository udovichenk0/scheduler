import { EventCallable, StoreWritable } from "effector"
import { useUnit } from "effector-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from "@/shared/ui/date-picker"
import { onMount } from "@/shared/lib/react/on-mount.ts"
import { Modal } from "@/shared/ui/modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { EditableContent } from "@/shared/ui/data-entry/editable-content"

import { Status as Status, Type as Type } from "../type"
import { formatTaskDate } from "../lib"
import { TaskStatus, TaskType } from "../model/task.model"

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
  dateChanged: EventCallable<{
    startDate: Nullable<Date>
    dueDate: Nullable<Date>
  }>
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
  const startDate = useUnit(modifyTaskModel.$startDate)
  const dueDate = useUnit(modifyTaskModel.$dueDate)
  const onChangeDate = useUnit(modifyTaskModel.dateChanged)
  const onChangeStatus = useUnit(modifyTaskModel.statusChanged)
  const onChangeDescription = useUnit(modifyTaskModel.descriptionChanged)
  const onChangeTitle = useUnit(modifyTaskModel.titleChanged)
  const onChangeType = useUnit(modifyTaskModel.typeChanged)

  const {
    isOpened: isTypeModalOpened,
    open: onOpenTypeModal,
    close: onCloseTypeModal,
  } = useDisclosure({ id: ModalName.TypeModal })

  onMount(() => inputRef.current?.focus())

  return (
    <div className="text-cTaskEditDefault flex w-full gap-2 rounded-[5px]">
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
          className="text-cFont text-sm font-medium outline-none"
        />
        <EditableContent
          aria-label="Add note"
          onSave={onChangeDescription}
          content={description || ""}
          placeholder="Note"
        />
        <div>
          <Button
            aria-label={`${taskType}: Choose type`}
            ref={typePickerRef}
            onClick={() => onOpenTypeModal()}
            size={"sm"}
            intent={"primary"}
            className="mb-1 flex gap-4 text-sm"
          >
            <Icon name={"common/inbox"} className="text-accent size-[18px]" />
            {t(`task.${taskType}`)}
          </Button>

          {dateModifier && (
            <DatePicker
              CustomInput={({ onClick }) => (
                <Button
                  onClick={onClick}
                  size={"sm"}
                  intent={"primary"}
                  className="flex items-center"
                >
                  <Icon
                    name={"common/upcoming"}
                    className="text-cTaskEditDefault mr-4 size-[18px]"
                  />
                  <span className="text-accent mr-1 text-sm">
                    {startDate && formatTaskDate(dayjs(startDate))}
                    {!startDate && "Start"}
                  </span>
                  <Icon
                    name="common/arrow-right"
                    className="text-cTaskEditDefault mr-1"
                  />
                  <span className="text-accent text-sm">
                    {dueDate && formatTaskDate(dayjs(dueDate))}
                    {!dueDate && "Due"}
                  </span>
                </Button>
              )}
              startDate={startDate}
              dueDate={dueDate}
              onDateChange={onChangeDate}
            />
          )}
        </div>
        <Modal
          label="Select event type"
          isOpened={isTypeModalOpened}
          closeModal={onCloseTypeModal}
        >
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
    <div
      ref={ref}
      className="bg-main flex w-[280px] cursor-pointer flex-col gap-y-1 rounded-[5px] p-3"
    >
      {types.map(({ type, iconName }, id) => {
        const active = type == currentType
        return (
          <Button
            key={id}
            size={"xs"}
            onClick={() => changeType(type)}
            className={`text-left ${
              active && "bg-cFocus block w-full focus:ring"
            }`}
            intent={"primary"}
          >
            <Icon
              name={iconName}
              className={`text-accent mr-4 h-5 w-5 focus:ring ${
                active && "text-hover"
              }`}
            />
            {t(`task.${type}`)}
          </Button>
        )
      })}
    </div>
  )
}
