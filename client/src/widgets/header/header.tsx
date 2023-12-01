import { useUnit } from "effector-react"
import { ReactNode, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/widgets/settings"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"
import { FilterConfig, SortType } from "@/entities/task/task-item"

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
  filter,
}: {
  iconName: IconName
  title: string | ReactNode
  filter?: {
    config: FilterConfig[]
    active: SortType
    onChange: (value: SortType) => SortType
  }
}) => {
  const [isFilterOpened, setIsFilterOpened] = useState(false)
  const r = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()
  const openPomodoroModal = useUnit($$pomodoroModal.open)
  const openSettingsModal = useUnit($$settingsModal.open)
  const isPomodoroRunning = useUnit($$pomodoro.$isPomodoroRunning)

  useClickOutside({ref: r, callback: () => setIsFilterOpened(false), deps: [isFilterOpened]})

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
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <Icon name={iconName} className="fill-cIconDefault text-2xl" />
          <Typography.Heading size="lg">{title}</Typography.Heading>
        </div>
        <div className="relative pr-1">
          {filter && (
            <div ref={r}>
              <button
                className="h-6 w-6"
                onClick={() => setIsFilterOpened((prev) => !prev)}
              >
                <Icon
                  name={`filter/${filter.active}`}
                  className="text-2xl text-cIconDefault"
                />
              </button>
              {isFilterOpened && (
                <div className="absolute right-0 z-[15] flex w-[215px] flex-col bg-menuBg">
                  {filter.config.map(({ value, label }) => {
                    return (
                      <button
                        key={value}
                        className={`px-4 py-3 hover:bg-cHover ${
                          value === filter.active && "bg-cHover"
                        }`}
                        onClick={() => {
                          filter.onChange(value)
                          setIsFilterOpened(false)
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}