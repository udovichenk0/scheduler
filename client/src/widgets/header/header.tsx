import { useUnit } from "effector-react"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/widgets/settings"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon, IconName } from "@/shared/ui/icon"
import { Container } from "@/shared/ui/general/container"
import { Pomodoro } from "@/shared/ui/pomodoro"
import { MainModal } from "@/shared/ui/modals/main"

import { $$pomodoroModal, $$settingsModal, $$pomodoro } from "./header.model"
import { PomodoroProgressBar } from "./ui/progress-bar"

export const Header = ({
  iconName,
  title,
}: {
  iconName: IconName
  title: string | ReactNode
}) => {
  const { t } = useTranslation()
  const [openPomodoroModal, openSettingsModal, isPomodoroRunning] = useUnit([
    $$pomodoroModal.open,
    $$settingsModal.open,
    $$pomodoro.$isPomodoroRunning,
  ])
  return (
    <Container padding="xl" className="relative mb-4 text-primary">
      <div className="flex h-[40px] items-center justify-end">
        {isPomodoroRunning ? (
          <PomodoroProgressBar
            onClick={openPomodoroModal}
            $currentStaticTime={$$pomodoro.$currentStaticTime}
            $tickingTime={$$pomodoro.$tickingTime}
            $isWorkTime={$$pomodoro.$isWorkTime}
            $isPomodoroRunning={$$pomodoro.$isPomodoroRunning}
          />
        ) : (
          <Button
            title="Pomodoro"
            intent={"primary"}
            size={"xs"}
            onClick={openPomodoroModal}
          >
            <Icon className="text-2xl text-cIconDefault" name="common/timer" />
          </Button>
        )}
      </div>

      <MainModal
        modal={$$pomodoroModal}
        className="w-[320px]"
        title={t("pomodoro.title")}
      >
        <Pomodoro
          pomodoroModel={$$pomodoro}
          $customDuration={$$pomodoroSettings.$customDuration}
          leftSlot={
            <>
              <Button
                intent={"primary"}
                size={"xs"}
                onClick={openSettingsModal}
              >
                <Icon
                  className="text-[24px] text-cIconDefault"
                  name="common/settings"
                />
              </Button>
              <Settings modal={$$settingsModal} defaultTab="pomodoro" />
            </>
          }
        />
      </MainModal>
      <div className="flex items-center gap-4">
        <Icon name={iconName} className="fill-cIconDefault text-2xl" />
        <Typography.Heading size="lg">{title}</Typography.Heading>
      </div>
    </Container>
  )
}