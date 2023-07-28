import { useUnit } from "effector-react"
import { Settings } from "@/widgets/settings"
import { Pomodoro } from "@/features/pomodoro"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Icon, IconName } from "@/shared/ui/icon"
import { pomodoroModal, settingsModal } from "./header.model"

export const Header = ({ icon, title }: { icon: IconName; title: string }) => {
  const [togglePomodoroModal, toggleSettingsModal] = useUnit([
    pomodoroModal.toggleTriggered,
    settingsModal.toggleTriggered,
  ])
  return (
    <div className="mb-5 px-4 text-primary">
      <div className="py-2 text-end">
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
        leftSlot={
          <>
            <IconButton
              onClick={toggleSettingsModal}
              className="text-[24px] text-cIconDefault"
              iconName="common/settings"
              intent={"primary"}
              size={"xs"}
            />
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
