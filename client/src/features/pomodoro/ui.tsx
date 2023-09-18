import { useUnit } from "effector-react"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { ModalType } from "@/shared/lib/modal"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { MainModal } from "@/shared/ui/modals/main"
import { Container } from "@/shared/ui/general/container"

import {
  $tickingTime,
  $isPomodoroRunning,
  startTimerTriggered,
  stopTimerTriggered,
  timeSelected,
  resetTimerTriggered,
  $isWorkTime,
  $stages,
  $currentStaticTime,
} from "./pomodoro.model"
import { ProgressCircle } from "./ui/circle-progress"
import { StartButton } from "./ui/start-button"
import { setCustomDuration } from "./config"
import { PomodoroDurations } from "./ui/work-durations"

const { $workDuration, $customDuration } = $$pomodoroSettings

export const Pomodoro = ({
  leftSlot,
  taskTitle,
  modal,
}: {
  leftSlot: ReactNode
  taskTitle?: string
  modal: ModalType
}) => {
  const { t } = useTranslation()
  const [startTimer, stopTimer, resetTimer, stages] = useUnit([
    startTimerTriggered,
    stopTimerTriggered,
    resetTimerTriggered,
    $stages,
  ])
  return (
    <MainModal modal={modal} className="w-[320px]" title={t("pomodoro.title")}>
      <div className="px-4">
        <PomodoroDurations
          timeSelected={timeSelected}
          $customDuration={$customDuration}
          $workDuration={$workDuration}
          setDuration={setCustomDuration}
        />
        {taskTitle && (
          <Container
            rounded="base"
            padding="sm"
            className="mb-3 bg-cHover text-center"
          >
            {taskTitle}
          </Container>
        )}
        <ProgressCircle
          $staticTime={$currentStaticTime}
          $isWorkTime={$isWorkTime}
          $time={$tickingTime}
          stages={stages}
        />
        <div className="mt-4 flex justify-between">
          {leftSlot}

          <StartButton
            $isWorkTime={$isWorkTime}
            stop={stopTimer}
            start={startTimer}
            $isTicking={$isPomodoroRunning}
          />

          <Button intent={"primary"} size={"xs"} onClick={resetTimer}>
            <Icon
              name="common/reset"
              className="text-[24px] text-cIconDefault"
            />
          </Button>
        </div>
      </div>
    </MainModal>
  )
}
