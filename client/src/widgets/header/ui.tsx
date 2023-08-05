import { useUnit } from "effector-react"

import { Settings } from "@/widgets/settings"

import { $isPomodoroRunning, Pomodoro } from "@/features/pomodoro"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon, IconName } from "@/shared/ui/icon"
import { Container } from "@/shared/ui/container"

import { pomodoroModal, settingsModal } from "./header.model"
import { PomodoroProgressBar } from "./ui/progress-bar"

export const Header = ({
  iconName,
  title,
}: {
  iconName: IconName
  title: string
}) => {
  const [togglePomodoroModal, toggleSettingsModal, isPomodoroRunning] = useUnit(
    [
      pomodoroModal.toggleTriggered,
      settingsModal.toggleTriggered,
      $isPomodoroRunning,
    ],
  )
  return (
    <Container padding="xl" className="text-primary">
      <div className="flex h-[40px] items-center justify-end">
        {isPomodoroRunning ? (
          <PomodoroProgressBar onClick={togglePomodoroModal} />
        ) : (
          <Button intent={"primary"} size={"xs"} onClick={togglePomodoroModal}>
            <Icon
              className="text-2xl text-cIconDefault"
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
        <Icon name={iconName} className="text-2xl fill-cIconDefault" />
        <Typography.Heading size="lg">{title}</Typography.Heading>
      </div>
    </Container>
  )
}
