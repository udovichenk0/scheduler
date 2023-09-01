import { MouseEvent, useRef } from "react"
import { createPortal } from "react-dom"

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
  return createPortal(
    <div
      ref={ref}
      onClick={handleOnClickOutside}
      className="absolute left-0 top-0 z-[1000] flex h-screen w-full items-center justify-center bg-black/40 text-primary"
    >
      <div className="absolute left-1/2 top-1/2 flex w-[270px] -translate-x-1/2 -translate-y-1/2  flex-col gap-1 rounded-[5px] border-[1px] border-cBorder bg-main p-3">
        <DatePicker currentDate={taskDate} onDateChange={changeDate} />
        <div className="flex gap-3 text-primary">
          <Button
            onClick={closeDatePicker}
            className="w-full p-[1px] text-[12px]"
          >
            Cancel
          </Button>
          <button
            onClick={() => {
              throw new Error("Not implemented")
            }}
            className="w-full rounded-[5px] bg-accent/50 p-[1px] text-[12px] duration-150 hover:bg-accent/40"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
