import { useUnit } from "effector-react"
import { Store } from "effector"

import { Button } from "@/shared/ui/buttons/main-button"
import { normalizeSeconds } from "@/shared/lib/date"

export const PomodoroProgressBar = ({
  onClick,
  $currentStaticTime,
  $tickingTime,
  $isWorkTime,
}: {
  onClick: () => void
  $currentStaticTime: Store<number>
  $tickingTime: Store<number>
  $isWorkTime: Store<boolean>
  $isPomodoroRunning: Store<boolean>
}) => {
  const pickedTime = useUnit($currentStaticTime)
  const passingTime = useUnit($tickingTime)
  const isWorkTime = useUnit($isWorkTime)

  const CIRCLE_SIZE = 565
  const progress =
    CIRCLE_SIZE - ((pickedTime - passingTime) / pickedTime) * CIRCLE_SIZE
  return (
    <Button
      intent={"primary"}
      size={"xs"}
      onClick={onClick}
      className={`flex items-center gap-2`}
    >
      <svg
        width="15"
        height="15"
        viewBox="-25 -25 250 250"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="-rotate-90"
      >
        <circle
          r="90"
          className={
            isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
          }
          cx="100"
          cy="100"
          strokeWidth="60px"
          strokeDashoffset={progress}
          fill="transparent"
          strokeDasharray="565px"
        ></circle>
      </svg>
      <span className="text-[12px]">{normalizeSeconds(passingTime)}</span>
    </Button>
  )
}
