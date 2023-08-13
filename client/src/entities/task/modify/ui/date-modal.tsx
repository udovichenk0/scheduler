import { MouseEvent, useRef } from "react"

import { Button } from "@/shared/ui/buttons/main-button"
import { DatePicker } from "@/shared/ui/date-picker"

export const DateModal = ({
  taskDate = new Date(),
  changeDate,
  closeDatePicker,
}: {
  taskDate: Date
  changeDate: (date: Date) => void
  closeDatePicker: () => void
}) => {
  const ref = useRef(null)
  const handleOnClickOutside = (e: MouseEvent) => {
    if (e.target === ref.current) {
      closeDatePicker()
    }
    e.stopPropagation()
  }
  return (
    <>
      <div
        ref={ref}
        onClick={handleOnClickOutside}
        className="absolute left-0 top-0 z-10 h-full w-full bg-black/50"
      />
      <div className="absolute z-[11] flex w-[270px] -translate-x-10  flex-col gap-1 rounded-[5px] border-[1px] border-cBorder bg-main p-3">
        <DatePicker currentDate={taskDate} onDateChange={changeDate} />
        <div className="flex gap-3 text-primary">
          <Button
            onClick={closeDatePicker}
            className="w-full p-[1px] text-[12px]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              throw new Error("Not implemented")
            }}
            intent={"filled"}
            className="w-full p-[1px] text-[12px]"
          >
            OK
          </Button>
        </div>
      </div>
    </>
  )
}
