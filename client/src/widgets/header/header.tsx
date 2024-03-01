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
import { Tooltip } from "@/shared/ui/general/tooltip"

type HeaderProps = {
  iconName: IconName,
  title: string | ReactNode,
  slot?: ReactNode
}

export const Header = ({
  iconName,
  title,
  slot
}: HeaderProps) => {

  const { t } = useTranslation()
  const openPomodoroModal = useUnit($$pomodoroModal.open)
  const openSettingsModal = useUnit($$settingsModal.open)
  const isPomodoroRunning = useUnit($$pomodoro.$isPomodoroRunning)

  return (
    <Container padding="xl" className="relative mb-4 text-primary">
      <div className="mb-2 flex h-[40px] items-center justify-end">
        <Tooltip text={t("pomodoro.title")} dir="bl">
          {isPomodoroRunning ? (
            <PomodoroProgressBar
              onClick={openPomodoroModal}
              $currentStaticTime={$$pomodoro.$currentStaticTime}
              $tickingTime={$$pomodoro.$tickingTime}
              $state={$$pomodoro.$state}
              $isPomodoroRunning={$$pomodoro.$isPomodoroRunning}
            />
          ) : (
            <Button
              title={t("setting.tab.pomodoro")}
              intent={"primary"}
              size={"xs"}
              onClick={openPomodoroModal}
            >
              <Icon className="text-2xl text-cIconDefault" name="common/timer" />
              <span className="sr-only">Open pomodoro</span>
            </Button>
          )}
        </Tooltip>
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
                <span className="sr-only">Open settings</span>
              </Button>
              <Settings modal={$$settingsModal} defaultTab="pomodoro" />
            </>
          }
        />
      </MainModal>
      <div className="flex h-10 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon name={iconName} className="fill-cIconDefault text-2xl" />
          <Typography.Heading size="lg">{title}</Typography.Heading>
        </div>
        <div className="relative">
          {slot}
        </div>
      </div>
    </Container>
  )
}
