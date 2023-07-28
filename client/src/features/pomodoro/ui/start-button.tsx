export const StartButton = ({
  start,
  stop,
  isTicking,
  isWorkTime,
}: {
  start: () => void
  stop: () => void
  isTicking: boolean
  isWorkTime: boolean
}) => {
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
          } border-style translate-x-[1px] border-x-[6px] border-b-[12px] border-t-[0px]`}
        />
      ) : (
        <span
          className={`h-0 w-0 rotate-90 ${
            isWorkTime ? "border-cPomodoroRed" : "border-cPomodoroGreen"
          } border-style translate-x-[1px] border-x-[6px] border-b-[12px] border-t-[0px] border-x-transparent `}
        />
      )}
    </button>
  )
}
