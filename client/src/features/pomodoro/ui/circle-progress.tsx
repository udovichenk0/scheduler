import { clsx } from "clsx"
import { normalizeSeconds } from "@/shared/lib/normalize-time"

export const ProgressCircle = ({
  time,
  isWorkTime,
  progress,
  stages,
}: {
  time: number
  isWorkTime: boolean
  progress: number
  stages: { fulfilled: boolean }[]
}) => {
  return (
    <div className="relative flex h-full w-full justify-center">
      <svg
        width="300"
        height="300"
        viewBox="-21.25 -31.25 312.5 312.5"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          r="125"
          cx="135"
          cy="135"
          className={
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
          }
          fill="transparent"
          strokeWidth="7px"
          strokeDasharray="2 7"
        ></circle>
        <circle
          r="125"
          cx="135"
          cy="135"
          className={clsx(
            "translate-y-[270px] -rotate-90",
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen",
          )}
          strokeWidth="8px"
          strokeDashoffset={progress}
          fill="transparent"
          strokeDasharray="785"
        ></circle>
        <text
          x="20%"
          y="49%"
          fontSize={60}
          className={isWorkTime ? "fill-cPomodoroRed" : "fill-cPomodoroGreen"}
        >
          {normalizeSeconds(time)}
        </text>
      </svg>
      <div className="absolute bottom-20 left-28 flex gap-2">
        {stages.map(({ fulfilled }, id) => {
          return (
            <div
              key={id}
              className={`h-[10px] w-[10px] rounded-full border-2 border-cPomodoroRed ${
                fulfilled && "bg-cPomodoroRed"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
