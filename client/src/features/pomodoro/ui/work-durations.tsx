import { Store, Event } from "effector"
import { useUnit } from "effector-react"

import { Icon } from "@/shared/ui/icon"
const defaultDurations = [
  { time: 5 },
  { time: 10 },
  { time: 15 },
  { time: 20 },
  { time: 25 },
  { time: 30 },
  { time: 45 },
  { time: 60 },
]
const calculateCircleDiameter = (time: number) => {
  return Math.ceil(2 * Math.sqrt(time)) + 5
}

export const PomodoroDurations = ({
  timeSelected,
  $customDuration,
  $workDuration,
  setDuration,
}: {
  timeSelected: Event<number>
  $customDuration: Store<number>
  $workDuration: Store<number>
  setDuration: ({
    defaultDurations,
    customDuration,
  }: {
    defaultDurations: { time: number }[]
    customDuration: number
  }) => { time: number }[]
}) => {
  const [selectTime, customDuration, workDuration] = useUnit([
    timeSelected,
    $customDuration,
    $workDuration,
  ])
  const durations = setDuration({
    defaultDurations,
    customDuration: customDuration,
  })
  return (
    <div className="mb-7 flex items-center justify-around">
      {durations.map(({ time }) => {
        const timeInSecond = time * 60
        const activeTimer = workDuration === time
        return (
          <div
            key={time}
            className="flex h-[60px] cursor-pointer flex-col items-center justify-between"
            onClick={() => selectTime(timeInSecond)}
          >
            <div className="flex h-10 items-center">
              <div
                style={{
                  width: calculateCircleDiameter(time),
                  height: calculateCircleDiameter(time),
                }}
                className={`${
                  activeTimer && "border-cPomodoroRed bg-cPomodoroRed"
                } flex items-center justify-center rounded-full border-2 border-cIconDefault`}
              >
                {activeTimer && <Icon name="common/done" className="w-[7px]" />}
              </div>
            </div>
            <span className="text-[12px] text-cIconDefault">{time}</span>
          </div>
        )
      })}
    </div>
  )
}
