import { clsx } from "clsx"
import { Store } from "effector"
import { useUnit } from "effector-react"

import { normalizeSeconds } from "@/shared/lib/date"
import { State } from "@/shared/lib/pomodoro"

const CIRCLE_DIAMETER = 260
const LINE_WIDTH = 7
const CIRCLE_RADIUS = CIRCLE_DIAMETER / 2 - LINE_WIDTH
const DEFAULT_PROGRESS_BAR = 2 * Math.PI * CIRCLE_RADIUS - 2
const CIRCLE_CENTERED_POSITION = CIRCLE_DIAMETER / 2

export const ProgressCircle = ({
  $time,
  $state,
  $stages,
  $staticTime,
}: {
  $time: Store<number>
  $state: Store<State>
  $stages: Store<{ fulfilled: boolean }[]>
  $staticTime: Store<number>
}) => {
  const time = useUnit($time)
  const state = useUnit($state)
  const staticTime = useUnit($staticTime)
  const stages = useUnit($stages)

  const isWorkTime = state == "work"
  const progress =
    DEFAULT_PROGRESS_BAR -
    ((staticTime - time) / staticTime) * DEFAULT_PROGRESS_BAR
  return (
    <div className="relative flex h-full w-full justify-center">
      <div
        className={`${
          isWorkTime ? "fill-cPomodoroRed" : "fill-cPomodoroGreen"
        } absolute top-1/2 -translate-y-1/2 text-5xl`}
      >
        {normalizeSeconds(time)}
      </div>
      <svg
        width={CIRCLE_DIAMETER}
        height={CIRCLE_DIAMETER}
        viewBox="0 0 260 260"
        version="1.1"
        className="relative -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          r={CIRCLE_RADIUS}
          cx={CIRCLE_CENTERED_POSITION}
          cy={CIRCLE_CENTERED_POSITION}
          className={
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
          }
          fill="transparent"
          strokeWidth={LINE_WIDTH}
          strokeDasharray="2 7"
        ></circle>
        <circle
          r={CIRCLE_RADIUS}
          cx={CIRCLE_CENTERED_POSITION}
          cy={CIRCLE_CENTERED_POSITION}
          className={clsx(
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen",
          )}
          strokeWidth={LINE_WIDTH}
          strokeDashoffset={progress}
          fill="transparent"
          strokeDasharray="772"
        ></circle>
      </svg>
      <div className="absolute bottom-[70px] grid h-10 grid-cols-4 grid-rows-3 gap-x-2 gap-y-1 pt-2">
        {stages.map(({ fulfilled }, id) => {
          return (
            <div
              key={id}
              className={`h-[10px] w-[10px] rounded-full border-2 
              ${isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"} 
              ${isWorkTime && fulfilled && "bg-cPomodoroRed"}
              ${!isWorkTime && fulfilled && "bg-cPomodoroGreen"}`}
            />
          )
        })}
      </div>
    </div>
  )
}
