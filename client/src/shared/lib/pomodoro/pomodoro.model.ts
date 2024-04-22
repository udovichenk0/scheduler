import {
  createEvent,
  createStore,
  sample,
  attach,
  createEffect,
  StoreWritable,
} from "effector"
import { spread, debug } from "patronum"

import { prepend } from "../effector"

import { createTimer } from "./timer"
import { State, defaultStgs } from "./config"

const DEFAULT_WORK_TIME = 1500 // 25mins
const MAX_STAGES_LENGTH = 12

type PomodoroProps = {
  notificationSound: HTMLAudioElement
  $workDuration: StoreWritable<number>
  $shortBreakDuration: StoreWritable<number>
  $longBreakDuration: StoreWritable<number>
  $isEnabledNotificationSound: StoreWritable<boolean>
  $isEnabledAutomaticStart: StoreWritable<boolean>
}

export type Stage = { fulfilled: boolean }
export type State = (typeof State)[keyof typeof State]

export const createPomodoro = ({
  notificationSound,
  $workDuration,
  $shortBreakDuration,
  $longBreakDuration,
  $isEnabledNotificationSound,
  $isEnabledAutomaticStart,
}: PomodoroProps) => {
  const $audio = createStore(notificationSound)
  const finishTimerFx = attach({
    source: $audio,
    effect: createEffect((autio: HTMLAudioElement) => {
      autio.play()
    }),
  })
  const { $timer, stopTimer, startTimer, setTimer, $isRunning } = createTimer({
    defaultTimerDuration: DEFAULT_WORK_TIME,
  })
  const timerEnded = createEvent()

  const $state = createStore<State>("work")
  const $stages = createStore(defaultStgs)
  const $currentStaticTime = createStore(DEFAULT_WORK_TIME)
  const $isInited = createStore(false)

  const $tempTime = createStore(0)

  const init = createEvent()
  const resetTimerTriggered = createEvent()
  const timeSelected = createEvent<number>()

  const $a = createStore(0)
  debug($a)
  sample({
    clock: timeSelected,
    target: [
      setTimer,
      $currentStaticTime,
      stopTimer,
      $stages.reinit,
      prepend($workDuration, (_, time: number) => time / 60),
    ],
  })
  sample({
    source: $timer,
    filter: (timer) => timer <= 0,
    target: timerEnded,
  })
  sample({
    clock: resetTimerTriggered,
    target: [$stages.reinit, stopTimer, $state.reinit, $tempTime.reinit],
  })
  sample({
    clock: resetTimerTriggered,
    source: $workDuration,
    fn: (duration) => duration * 60,
    target: [$currentStaticTime, setTimer],
  })
  sample({
    clock: $workDuration,
    filter: (duration) => !!Number(duration),
    fn: (duration) => duration * 60,
    target: [$currentStaticTime, setTimer],
  })
  sample({
    clock: init,
    source: { d: $workDuration, i: $isInited },
    filter: ({ d, i }) => !!Number(d) && !i,
    fn: ({ d }) => d * 60,
    target: [prepend($isInited, true), setTimer, $currentStaticTime],
  })

  sample({
    clock: timerEnded,
    filter: $isEnabledNotificationSound,
    target: finishTimerFx,
  })

  sample({
    clock: timerEnded,
    source: {
      s: $state,
      stages: $stages,
      long: $longBreakDuration,
      short: $shortBreakDuration,
      work: $workDuration,
    },
    fn: ({ s, stages, long, short, work }) => {
      if (s == State.WORK) {
        const shouldLongBreak = stages[stages.length - 2].fulfilled
        const newStages = updateStage(stages)

        const time = shouldLongBreak ? long : short
        const state = shouldLongBreak ? State.LONG : State.SHORT
        return {
          time: time * 60,
          state: state,
          stages: newStages,
        }
      }
      return {
        time: work * 60,
        state: State.WORK,
        stages: s == State.SHORT ? stages : addStages(stages),
      }
    },
    target: spread({
      time: $currentStaticTime,
      state: $state,
      stages: $stages,
    }),
  })
  sample({
    clock: $state,
    source: $isEnabledAutomaticStart,
    filter: (isAuto, state) => state == State.WORK && !isAuto,
    target: stopTimer,
  })
  sample({
    clock: $stages,
    filter: (s) => s.length > MAX_STAGES_LENGTH,
    target: resetTimerTriggered,
  })

  sample({
    clock: $currentStaticTime,
    filter: Boolean,
    target: setTimer,
  })

  function updateStage(stages: Stage[]) {
    const lastFulfilled = stages.findLastIndex((value) => value.fulfilled) + 1
    return stages.map((s, ind) =>
      ind == lastFulfilled ? { fulfilled: true } : s,
    )
  }
  function addStages(stages: Stage[]) {
    return stages.concat(defaultStgs)
  }

  return {
    init,
    startTimerTriggered: startTimer,
    stopTimerTriggered: stopTimer,
    $isPomodoroRunning: $isRunning,
    $workDuration,
    $tickingTime: $timer,
    $stages,
    $state,
    $currentStaticTime,
    timeSelected,
    resetTimerTriggered,
  }
}
export type PomodoroFactory = ReturnType<typeof createPomodoro>
