import { RefObject } from "react"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { DatePicker } from "@/shared/ui/date-picker"

export const DateModal = ({
  outRef,
  taskDate,
  changeDate,
  closeDatePicker,
}: {
  outRef: RefObject<HTMLDivElement>
  taskDate: Date
  changeDate: (date: Date) => void
  closeDatePicker: () => void
}) => {
  return (
    <>
      <div
        onClick={(e) => onClickOutside(outRef, e, closeDatePicker)}
        className="absolute left-0 top-0 z-10 h-full w-full bg-black/50"
      />
      <div
        ref={outRef}
        className="absolute top-2 z-[11] flex w-[270px] translate-x-[-50px] flex-col gap-1 rounded-[5px] border-[1px] border-cBorder bg-main p-3"
      >
        <DatePicker currentDate={taskDate} onDateChange={changeDate} />
        <div className="flex gap-3">
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
