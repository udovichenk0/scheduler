import { clsx } from "clsx"
import { useUnit } from "effector-react/effector-react.mjs"
import { ReactNode, RefObject } from "react"
import { Pomodoro } from "@/features/pomodoro"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
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
        <Button 
          onClick={togglePomodoroModal}
          intent={"primary"} 
          size={"xs"}>
          <Icon name="common/timer" className="text-[24px] text-cIconDefault" />
        </Button>
      </div>
      <Pomodoro
        modal={pomodoroModal}
        taskTitle={taskTitle}
        leftSlot={
          <>
          <Button 
            onClick={toggleSettingsModal}
            intent={"primary"} 
            size={"xs"}>
            <Icon name="common/settings" className="text-[24px] text-cIconDefault" />
          </Button>
            <Settings modal={settingsModal} defaultTab="pomodoro" />
          </>
        }
      />
    </div>
  )
}
