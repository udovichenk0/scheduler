import { useUnit } from "effector-react"
import { ReactNode, RefObject } from "react"
import { Store, Event } from "effector"

import { Pomodoro } from "@/features/pomodoro"

import { ModifyTaskForm } from "@/entities/task/task-form"
import { $$dateModal } from "@/entities/task/task-item"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"
import { DatePicker } from "@/shared/ui/date-picker"

import { Settings } from "../settings"

import { pomodoroModal, settingsModal } from "./model"

type ModifyTaskFormType = {
  $title: Store<string>
  $description: Store<string>
  $status: Store<"FINISHED" | "INPROGRESS">
  $type: Store<"inbox" | "unplaced">
  $startDate: Store<Nullable<Date>>
  statusChanged: Event<"FINISHED" | "INPROGRESS">
  descriptionChanged: Event<string>
  titleChanged: Event<string>
  typeChanged: Event<"inbox" | "unplaced">
  dateChanged: Event<Date>
}

export const ExpandedTask = ({
  taskRef,
  dateModifier,
  modifyTaskModel,
  sideDatePicker = true,
  rightPanelSlot,
}: {
  taskRef?: RefObject<HTMLDivElement>
  dateModifier?: boolean
  modifyTaskModel: ModifyTaskFormType
  sideDatePicker?: boolean
  rightPanelSlot?: ReactNode
}) => {
  const [
    openPomodoroModal,
    openSettingsModal,
    startDate,
    changeDate,
    title,
    openDateModal,
    closeDateModal,
  ] = useUnit([
    pomodoroModal.open,
    settingsModal.open,
    modifyTaskModel.$startDate,
    modifyTaskModel.dateChanged,
    modifyTaskModel.$title,
    $$dateModal.open,
    $$dateModal.close,
  ])
  const onChangeDate = (date: Date) => {
    closeDateModal()
    changeDate(date)
  }

  return (
    <div ref={taskRef} className="group flex gap-2">
      {sideDatePicker && (
        <Icon
          onClick={openDateModal}
          name="common/upcoming"
          className="invisible translate-y-1 text-lg text-accent group-hover:visible"
        />
      )}
      <BaseModal modal={$$dateModal}>
        <DatePicker
          currentDate={startDate || new Date()}
          onDateChange={onChangeDate}
          onCancel={() => console.log("cancel")}
          onSave={() => console.log("cancel")}
        />
      </BaseModal>
      <div
        className={
          "flex w-full flex-col rounded-[5px] bg-cTaskEdit p-2 text-sm"
        }
      >
        <ModifyTaskForm
          dateModifier={dateModifier}
          modifyTaskModel={modifyTaskModel}
        />
        <div className="flex items-center justify-end space-x-1">
          <Button onClick={openPomodoroModal} intent={"primary"} size={"xs"}>
            <Icon
              name="common/timer"
              className="text-[24px] text-cIconDefault"
            />
          </Button>
          <Button onClick={openDateModal} intent={"primary"} size={"xs"}>
            <Icon
              name="common/upcoming"
              className="p-[3px] text-[19px] text-cIconDefault"
            />
          </Button>
          {rightPanelSlot}
        </div>
        <PomodoroModal title={title} toggleSettingsModal={openSettingsModal} />
      </div>
    </div>
  )
}

const PomodoroModal = ({
  title,
  toggleSettingsModal,
}: {
  title?: string
  toggleSettingsModal: () => void
}) => {
  return (
    <Pomodoro
      modal={pomodoroModal}
      taskTitle={title}
      leftSlot={
        <>
          <Button onClick={toggleSettingsModal} intent={"primary"} size={"xs"}>
            <Icon
              name="common/settings"
              className="text-[24px] text-cIconDefault"
            />
          </Button>
          <Settings modal={settingsModal} defaultTab="pomodoro" />
        </>
      }
    />
  )
}
