import { EventCallable, Store } from "effector"
import { useUnit } from "effector-react"
import { useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"
import { DatePicker } from "@/shared/ui/date-picker"
import { ModalType } from "@/shared/lib/modal"

import { $$dateModal, $$typeModal } from "./modify.model"
import { formatTaskDate } from "./lib/normalize-date"

type ModifyTaskFormType = {
  $title: Store<string>
  $description: Store<string>
  $status: Store<"FINISHED" | "INPROGRESS">
  $type: Store<"inbox" | "unplaced">
  $startDate: Store<Nullable<Date>>
  statusChanged: EventCallable<"FINISHED" | "INPROGRESS">
  descriptionChanged: EventCallable<string>
  titleChanged: EventCallable<string>
  typeChanged: EventCallable<"inbox" | "unplaced">
  dateChanged: EventCallable<Date>
}

export const ModifyTaskForm = ({
  modifyTaskModel,
  dateModifier = true,
}: {
  modifyTaskModel: ModifyTaskFormType
  dateModifier?: boolean
}) => {
  const title = useUnit(modifyTaskModel.$title)
  const description = useUnit(modifyTaskModel.$description)
  const status = useUnit(modifyTaskModel.$status)
  const taskType = useUnit(modifyTaskModel.$type)
  const taskDate = useUnit(modifyTaskModel.$startDate)
  const changeStatus = useUnit(modifyTaskModel.statusChanged)
  const changeDescription = useUnit(modifyTaskModel.descriptionChanged)
  const changeTitle = useUnit(modifyTaskModel.titleChanged)
  const changeType = useUnit(modifyTaskModel.typeChanged)
  const changeDate = useUnit(modifyTaskModel.dateChanged)
  const openDateModal = useUnit($$dateModal.open)
  const closeDateModal = useUnit($$dateModal.close)
  const openTypeModal = useUnit($$typeModal.open)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  useEffect(() => {
    titleInputRef.current!.focus()
  }, [])

  return (
    <div className="flex w-full gap-2 rounded-[5px] text-cTaskEditDefault">
      <span>
        <Checkbox
          iconClassName="fill-cTaskEditDefault"
          checked={status == "FINISHED"}
          onChange={() => changeStatus(status)}
        />
      </span>
      <div className="ml-1 flex w-full flex-col gap-3">
        <input
          onChange={(e) => changeTitle(e.target.value)}
          value={title}
          ref={titleInputRef}
          placeholder={title ? "" : t("taskForm.newTask")}
          className="w-full bg-transparent text-sm font-medium text-cFont outline-none dark:text-gray-300"
        />
        <input
          className="w-full bg-transparent text-sm text-grey outline-none"
          placeholder={description ? "" : t("taskForm.note")}
          value={description || ""}
          onChange={(e) => changeDescription(e.target.value)}
        />
        <div className="space-y-1">
          <Button
            onClick={openTypeModal}
            size={"sm"}
            intent={"primary"}
            className="flex gap-4"
          >
            <Icon
              name={"common/inbox"}
              className="h-[18px] w-[18px] text-accent"
            />
            <span>{t(`task.${taskType}`)}</span>
          </Button>

          {dateModifier && (
            <Button
              onClick={openDateModal}
              size={"sm"}
              intent={"primary"}
              className="flex"
            >
              <Icon
                name={"common/upcoming"}
                className="mr-4 h-[18px] w-[18px] text-cTaskEditDefault"
              />
              <span>{t("taskForm.date")}</span>
              <span className="ml-2 text-accent">
                {taskDate && formatTaskDate(taskDate)}
              </span>
            </Button>
          )}
        </div>
        <TypePickerModal
          $$modal={$$typeModal}
          currentType={taskType}
          changeType={changeType}
        />
        <BaseModal $$modal={$$dateModal}>
          <DatePicker
            currentDate={taskDate || new Date()}
            onDateChange={changeDate}
            onCancel={closeDateModal}
            onSave={() => {
              throw new Error("Not implemented")
            }}
          />
        </BaseModal>
      </div>
    </div>
  )
}

const types = [
  { type: "inbox", iconName: "common/inbox" },
  { type: "unplaced", iconName: "common/inbox" },
] as const

const TypePickerModal = ({
  currentType,
  changeType,
  $$modal,
}: {
  currentType: "inbox" | "unplaced"
  changeType: (payload: "inbox" | "unplaced") => void
  $$modal: ModalType
}) => {
  const { t } = useTranslation()
  return (
    <BaseModal $$modal={$$modal}>
      <div className="flex w-[280px] cursor-pointer flex-col gap-y-1 rounded-[5px] bg-main p-3">
        {types.map(({ type, iconName }, id) => {
          const active = type == currentType
          return (
            <Button
              key={id}
              size={"xs"}
              onClick={() => changeType(type)}
              className={`text-left ${
                active && "pointer-events-none block w-full bg-cFocus"
              }`}
              intent={"primary"}
            >
              <Icon
                name={iconName}
                className={`mr-4 h-5 w-5 text-accent ${
                  active && "text-cHover"
                }`}
              />
              {t(`task.${type}`)}
            </Button>
          )
        })}
      </div>
    </BaseModal>
  )
}
