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
        width="260"
        height="260"
        viewBox="-14.25 -0.25 312.5 312.5"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          r="135"
          cx="145"
          cy="145"
          className={
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
          }
          fill="transparent"
          strokeWidth="7px"
          strokeDasharray="2 7"
        ></circle>
        <circle
          r="135"
          cx="145"
          cy="145"
          className={clsx(
            "translate-y-[290px] -rotate-90",
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen",
          )}
          strokeWidth="8px"
          strokeDashoffset={progress}
          fill="transparent"
          strokeDasharray="848"
        ></circle>
        <text
          x="22%"
          y="51%"
          fontSize={60}
          className={isWorkTime ? "fill-cPomodoroRed" : "fill-cPomodoroGreen"}
        >
          {normalizeSeconds(time)}
        </text>
      </svg>
      <div className="absolute bottom-[70px] left-[113px] grid h-[40px] grid-cols-4 grid-rows-3 gap-x-2 gap-y-1">
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
