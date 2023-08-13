import { useUnit } from "effector-react"
import { RefObject, useState } from "react"
import { Store, Event } from "effector"

import { Pomodoro } from "@/features/pomodoro"

import { DateModal } from "@/entities/task/modify/ui/date-modal"
import { ModifyTaskForm } from "@/entities/task/modify"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

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
}: {
  taskRef: RefObject<HTMLDivElement>
  dateModifier: boolean
  modifyTaskModel: ModifyTaskFormType
}) => {
  const [isDatePickerOpened, setDatePickerOpen] = useState(false)
  const [
    togglePomodoroModal,
    toggleSettingsModal,
    startDate,
    changeDate,
    title,
  ] = useUnit([
    pomodoroModal.toggleTriggered,
    settingsModal.toggleTriggered,
    modifyTaskModel.$startDate,
    modifyTaskModel.dateChanged,
    modifyTaskModel.$title,
  ])
  const onChangeDate = (date: Date) => {
    setDatePickerOpen(false)
    changeDate(date)
  }
  return (
    <div ref={taskRef} className="group flex gap-2">
        <Icon
          onClick={() => setDatePickerOpen(true)}
          name="common/upcoming"
          className="invisible translate-y-2 text-lg text-accent group-hover:visible"
        />
        {isDatePickerOpened && (
          <DateModal
            taskDate={startDate || new Date()}
            changeDate={onChangeDate}
            closeDatePicker={() => setDatePickerOpen(false)}
          />
        )}
      <div
        className={
          "mb-2 flex w-full flex-col rounded-[5px] bg-cTaskEdit p-2 text-sm"
        }
      >
        <ModifyTaskForm
          dateModifier={dateModifier}
          modifyTaskModel={modifyTaskModel}
        />
        <div className="space-x-2 text-end">
          <Button onClick={togglePomodoroModal} intent={"primary"} size={"xs"}>
            <Icon
              name="common/timer"
              className="text-[24px] text-cIconDefault"
            />
          </Button>
          <Button
            onClick={() => setDatePickerOpen(true)}
            intent={"primary"}
            size={"xs"}
          >
            <Icon
              name="common/upcoming"
              className="p-[3px] text-[18px] text-cIconDefault"
            />
          </Button>
        </div>
        <PomodoroModal
          title={title}
          toggleSettingsModal={toggleSettingsModal}
        />
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
