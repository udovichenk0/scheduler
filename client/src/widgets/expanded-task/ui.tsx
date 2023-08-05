import { useUnit } from "effector-react/effector-react.mjs"
import { ReactNode, RefObject } from "react"

import { Pomodoro } from "@/features/pomodoro"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

import { Settings } from "../settings"

import { pomodoroModal, settingsModal } from "./model"

export const ExpandedTask = ({
  taskRef,
  children,
  taskTitle,
}: {
  taskRef: RefObject<HTMLDivElement>
  children: ReactNode
  taskTitle?: string
}) => {
  const [togglePomodoroModal, toggleSettingsModal] = useUnit([
    pomodoroModal.toggleTriggered,
    settingsModal.toggleTriggered,
  ])
  return (
    <div
      ref={taskRef}
      className={
        "mb-2 flex w-full flex-col rounded-[5px] bg-cTaskEdit p-2 text-sm"
      }
    >
      {children}
      <div className="text-end">
        <Button onClick={togglePomodoroModal} intent={"primary"} size={"xs"}>
          <Icon name="common/timer" className="text-[24px] text-cIconDefault" />
        </Button>
      </div>
      <PomodoroModal
        title={taskTitle}
        toggleSettingsModal={toggleSettingsModal}
      />
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
