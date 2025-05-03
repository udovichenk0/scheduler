import { useUnit } from "effector-react"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import Settings from "@/widgets/settings"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { Typography } from "@/shared/ui/general/typography"
import { Icon, IconName } from "@/shared/ui/icon"
import { Container } from "@/shared/ui/general/container"
import { Pomodoro } from "@/shared/ui/pomodoro"
import { Tooltip } from "@/shared/ui/general/tooltip"
import { CloseButton, Modal } from "@/shared/ui/modal"
import { normalizeSeconds } from "@/shared/lib/date"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { Button } from "@/shared/ui/buttons/main-button"

import { ProgressBar } from "./ui/progress-bar"
import { $$pomodoro } from "./header.model"

type HeaderProps = {
  iconName: IconName
  title: string | ReactNode
  slot?: ReactNode
}

export const Header = ({ iconName, title, slot }: HeaderProps) => {
  const {
    isOpened: isSettingsOpened,
    open: onOpenSettings,
    close: onCloseSettings,
  } = useDisclosure({ id: ModalName.PomodoroSettingsModal })

  const {
    isOpened: isPomodoroOpened,
    open: onOpenPomodoro,
    close: onClosePomodoro,
  } = useDisclosure({ id: ModalName.PomodoroModal })

  return (
    <Container padding="xl" className="text-primary">
      <div className="mb-2 flex h-10 items-center justify-end">
        <Modal
          label="Pomodoro"
          isOpened={isPomodoroOpened}
          closeModal={onClosePomodoro}
        >
          <PomodoroButton onOpenPomodoro={onOpenPomodoro} />
          <Modal.Overlay className="bg-transparent">
            <Modal.Body>
              <Modal.Header>
                <span className="w-full pl-6 text-center text-[12px]">
                  Pomodoro
                </span>
                <CloseButton close={onClosePomodoro} />
              </Modal.Header>
              <Modal.Content>
                <Pomodoro
                  pomodoroModel={$$pomodoro}
                  $customDuration={$$pomodoroSettings.$customDuration}
                  leftSlot={
                    <>
                      <Button
                        intent="primary"
                        size="xs"
                        onClick={onOpenSettings}
                      >
                        <Icon
                          className="text-cIconDefault text-[24px]"
                          name="common/settings"
                        />
                        <span className="sr-only">Open settings</span>
                      </Button>
                      <Settings
                        isOpen={isSettingsOpened}
                        onClose={onCloseSettings}
                        defaultTab="pomodoro"
                      />
                    </>
                  }
                />
              </Modal.Content>
            </Modal.Body>
          </Modal.Overlay>
        </Modal>
      </div>
      <div className="flex h-10 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon name={iconName} className="fill-cIconDefault text-2xl" />
          <Typography.Heading size="lg">{title}</Typography.Heading>
        </div>
        <div className="relative flex items-center gap-2">{slot}</div>
      </div>
    </Container>
  )
}

const PomodoroButton = ({ onOpenPomodoro }: { onOpenPomodoro: () => void }) => {
  const { t } = useTranslation()
  const isPomodoroRunning = useUnit($$pomodoro.$isPomodoroRunning)
  const passingTime = useUnit($$pomodoro.$tickingTime)
  return (
    <Tooltip text={t("pomodoro.title")} dir="bl">
      {isPomodoroRunning ? (
        <Modal.Trigger
          intent={"primary"}
          size={"xs"}
          onClick={onOpenPomodoro}
          className={`flex items-center gap-2`}
        >
          <ProgressBar
            $currentStaticTime={$$pomodoro.$currentStaticTime}
            $tickingTime={$$pomodoro.$tickingTime}
            $state={$$pomodoro.$state}
            $isPomodoroRunning={$$pomodoro.$isPomodoroRunning}
          />
          <span className="text-[12px]">{normalizeSeconds(passingTime)}</span>
        </Modal.Trigger>
      ) : (
        <Modal.Trigger
          title={t("setting.tab.pomodoro")}
          intent={"primary"}
          size={"xs"}
          onClick={onOpenPomodoro}
        >
          <Icon className="text-cIconDefault text-2xl" name="common/timer" />
          <span className="sr-only">Open pomodoro</span>
        </Modal.Trigger>
      )}
    </Tooltip>
  )
}
