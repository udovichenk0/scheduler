import { useUnit } from "effector-react"
import { Settings } from "@/widgets/settings"
import { $isPomodoroRunning, Pomodoro } from "@/features/pomodoro"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon, IconName } from "@/shared/ui/icon"
import { pomodoroModal, settingsModal } from "./header.model"
import { PomodoroProgressBar } from "./ui/progress-bar"

export const Header = ({ icon, title }: { icon: IconName; title: string }) => {
  const [togglePomodoroModal, toggleSettingsModal, isPomodoroRunning] = useUnit(
    [
      pomodoroModal.toggleTriggered,
      settingsModal.toggleTriggered,
      $isPomodoroRunning,
    ],
  )
  return (
    <div className="mb-5 px-4 text-primary">
      <div className="flex h-[40px] items-center justify-end py-2">
        {isPomodoroRunning ? (
          <PomodoroProgressBar onClick={togglePomodoroModal} />
        ) : (
          <Button intent={"primary"} size={"xs"} onClick={togglePomodoroModal}>
            <Icon
              className="text-[24px] text-cIconDefault"
              name="common/timer"
            />
          </Button>
        )}
      </div>
      <Pomodoro
        modal={pomodoroModal}
        leftSlot={
          <>
            <Button
              intent={"primary"}
              size={"xs"}
              onClick={toggleSettingsModal}
            >
              <Icon
                className="text-[24px] text-cIconDefault"
                name="common/settings"
              />
            </Button>
            <Settings modal={settingsModal} defaultTab="pomodoro" />
          </>
        }
      />
      <div className="flex items-center gap-4">
        <Icon name={icon} className="h-5 w-5 fill-cIconDefault" />
        <h2 className="text-[24px]">{title}</h2>
      </div>
    </div>
  )
}
