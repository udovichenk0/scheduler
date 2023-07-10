import { RefObject } from "react"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { DatePicker } from "@/shared/ui/date-picker"

export const DateModal = ({
  outRef,
  currentDate,
  changeDate,
  closeDatePicker
}:{
  outRef: RefObject<HTMLDivElement>,
  currentDate: Date,
  changeDate: (date: Date) => void,
  closeDatePicker: () => void
}) => {
    return (
    <>
    <div onClick={(e) => onClickOutside(outRef, e, closeDatePicker)} className='absolute w-full h-full bg-black/50 left-0 top-0 z-10'/>
    <div ref={outRef} className='w-[270px] border-[1px] border-cBorder bg-main absolute top-2 p-3 translate-x-[-50px] rounded-[5px] z-[11] flex flex-col gap-1'>
      <div className="mb-4">
        <DatePicker 
        currentDate={currentDate} 
        onDateChange={changeDate}/>
      </div>

      <div className="flex w-full gap-3">
        <Button onClick={closeDatePicker} title="Cancel" className="flex w-full text-[12px] p-[1px] justify-center" />
        <Button onClick={() => {throw new Error('Not implemented')}} intent={'filled'} title="OK" className="flex p-[1px] w-full text-[12px] justify-center" />
      </div>
    </div>
    </>
  )
}