import { Store } from "effector"
import { useUnit } from "effector-react"
export const StartButton = ({
  start,
  stop,
  $isTicking,
  $isWorkTime,
}: {
  start: () => void
  stop: () => void
  $isTicking: Store<boolean>
  $isWorkTime: Store<boolean>
}) => {
  const [isTicking, isWorkTime] = useUnit([$isTicking, $isWorkTime])
  return (
    <button
      className={`flex h-8 w-8 justify-center rounded-full outline-none ${
        isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
      } items-center  border-2`}
      onClick={isTicking ? stop : start}
    >
      {isTicking ? (
        <span
          className={`h-0 w-0 rotate-90 ${
            isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
          } border-style translate-x border-x-[6px] border-b-[12px] border-t-0`}
        />
      ) : (
        <span
          className={`h-0 w-0 rotate-90 ${
            isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
          } border-style translate-x border-x-[6px] border-b-[12px] border-t-0 border-x-transparent`}
        />
      )}
    </button>
  )
}
