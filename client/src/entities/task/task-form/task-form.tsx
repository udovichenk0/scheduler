import { Event as EffectorEvent, Store } from "effector"
import { useUnit } from "effector-react"
import { useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"
import { DatePicker } from "@/shared/ui/date-picker"

import { $$dateModal, $$typeModal } from "./modify.model"
import { formatTaskDate } from "./lib/normalize-date"
import { TypePickerModal } from "./ui/type-modal"

type ModifyTaskFormType = {
  $title: Store<string>
  $description: Store<string>
  $status: Store<"FINISHED" | "INPROGRESS">
  $type: Store<"inbox" | "unplaced">
  $startDate: Store<Nullable<Date>>
  statusChanged: EffectorEvent<"FINISHED" | "INPROGRESS">
  descriptionChanged: EffectorEvent<string>
  titleChanged: EffectorEvent<string>
  typeChanged: EffectorEvent<"inbox" | "unplaced">
  dateChanged: EffectorEvent<Date>
}

export const ModifyTaskForm = ({
  modifyTaskModel,
  dateModifier = true,
}: {
  modifyTaskModel: ModifyTaskFormType
  dateModifier?: boolean
}) => {
  const [
    title,
    description,
    status,
    taskType,
    taskDate,
    changeStatus,
    changeDescription,
    changeTitle,
    changeType,
    changeDate,
    openDateModal,
    closeDateModal,
    openTypeModal,
  ] = useUnit([
    modifyTaskModel.$title,
    modifyTaskModel.$description,
    modifyTaskModel.$status,
    modifyTaskModel.$type,
    modifyTaskModel.$startDate,
    modifyTaskModel.statusChanged,
    modifyTaskModel.descriptionChanged,
    modifyTaskModel.titleChanged,
    modifyTaskModel.typeChanged,
    modifyTaskModel.dateChanged,
    $$dateModal.open,
    $$dateModal.close,
    $$typeModal.open,
  ])
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
        <TypePickerModal $$modal={$$typeModal} currentType={taskType} changeType={changeType} />
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
