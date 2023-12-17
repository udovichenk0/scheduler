import { useUnit } from "effector-react"
import { ReactNode, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/widgets/settings"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"
import { SortConfig, SortType, TaskSorting } from "@/entities/task/task-item"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon, IconName } from "@/shared/ui/icon"
import { Container } from "@/shared/ui/general/container"
import { Pomodoro } from "@/shared/ui/pomodoro"
import { MainModal } from "@/shared/ui/modals/main"
import { useClickOutside } from "@/shared/lib/react/on-click-outside"

import { $$pomodoroModal, $$settingsModal, $$pomodoro } from "./header.model"
import { PomodoroProgressBar } from "./ui/progress-bar"

export const Header = ({
  iconName,
  title,
  sorting,
}: {
  iconName: IconName
  title: string | ReactNode
  sorting?: {
    config: SortConfig[]
    active: SortType
    onChange: (value: SortType) => SortType
  }
}) => {
  const [isSortingOpened, setIsSortingOpened] = useState(false)
  const r = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()
  const openPomodoroModal = useUnit($$pomodoroModal.open)
  const openSettingsModal = useUnit($$settingsModal.open)
  const isPomodoroRunning = useUnit($$pomodoro.$isPomodoroRunning)

  useClickOutside({
    ref: r,
    callback: () => setIsSortingOpened(false),
    deps: [isSortingOpened],
  })

  return (
    <Container padding="xl" className="relative mb-4 text-primary">
      <div className="mb-2 flex h-[40px] items-center justify-end">
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
            title={t("setting.tab.pomodoro")}
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
      <div className="flex h-10 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon name={iconName} className="fill-cIconDefault text-2xl" />
          <Typography.Heading size="lg">{title}</Typography.Heading>
        </div>
        <div className="relative pr-1">
          {sorting && (
            <div ref={r}>
              <Button
                intent={"primary"}
                size={"xs"}
                onClick={() => setIsSortingOpened((prev) => !prev)}
              >
                <Icon
                  name={`sort/${sorting.active}`}
                  className="text-2xl text-cIconDefault"
                />
              </Button>
              {isSortingOpened && (
                <TaskSorting
                  onChange={(value) => {
                    setIsSortingOpened(false)
                    sorting.onChange(value)
                  }}
                  config={sorting.config}
                  active={sorting.active}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
