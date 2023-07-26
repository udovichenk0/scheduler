import { clsx } from "clsx"
import { useUnit } from "effector-react/effector-react.mjs"
import { ReactNode, RefObject } from "react"
import { Pomodoro } from "@/features/pomodoro"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Settings } from "../settings"
import { pomodoroModal, settingsModal } from "./model"

export const ExpandedTask = ({
  taskRef,
  className,
  children,
  taskTitle,
}: {
  taskRef: RefObject<HTMLDivElement>
  className?: string
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
      className={clsx(
        "flex w-full flex-col rounded-[5px] bg-cTaskEdit px-2 py-2 text-sm",
        className,
      )}
    >
      <div className="w-full">{children}</div>
      <div className="text-end">
        <IconButton
          className="text-[24px] text-cIconDefault"
          iconName="common/timer"
          intent={"primary"}
          size={"xs"}
          onClick={togglePomodoroModal}
        />
      </div>
      <Pomodoro
        modal={pomodoroModal}
        taskTitle={taskTitle}
        leftSlot={
          <>
            <IconButton
              onClick={toggleSettingsModal}
              className="text-[24px] text-cIconDefault"
              iconName="common/settings"
              intent={"primary"}
              size={"xs"}
            />
            <Settings modal={settingsModal} defaultTab="general" />
          </>
        }
      />
    </div>
  )
}
