import { Store } from "effector"
import { useUnit } from "effector-react"

import { State } from "@/shared/lib/pomodoro"
export const StartButton = ({
  start,
  stop,
  $isTicking,
  $state,
}: {
  start: () => void
  stop: () => void
  $isTicking: Store<boolean>
  $state: Store<State>
}) => {
  const isTicking = useUnit($isTicking)
  const state = useUnit($state)
  const isWorkTime = state == "work"
  return (
    <button
      className={`flex h-8 w-8 justify-center rounded-full outline-none focus-visible:ring ${
        isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
      } items-center  border-2`}
      onClick={isTicking ? stop : start}
    >
      {isTicking ? (
        <span
          className={`h-0 w-0 rotate-90 ${
            isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
          } border-style translate-x border-x-[6px] border-b-[12px] border-t-0`}
        >
          <span className="sr-only">Stop the timer</span>
        </span>
      ) : (
        <span
          className={`h-0 w-0 rotate-90 ${
            isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
          } border-style translate-x border-x-[6px] border-b-[12px] border-t-0 border-x-transparent`}
        >
          <span className="sr-only">Start the timer</span>
        </span>
      )}
    </button>
  )
}
