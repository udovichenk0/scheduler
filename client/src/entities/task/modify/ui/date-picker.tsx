import dayjs from "dayjs"
import { RefObject, useState } from "react"
import { changeMonth } from "@/shared/lib/change-month"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

export const DatePicker = ({
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
  const [date, setDate] = useState(changeMonth())
  const [month, setMonth] = useState(dayjs().month())
  const isCurrentMonth = dayjs().month() === month
  const handle = (month: number) => {
    if(dayjs().month() <= month){
      setMonth(month)
      setDate(changeMonth(month))
    }
  }
  return (
    <>
    <div ref={outRef} onClick={(e) => onClickOutside(outRef, e, closeDatePicker)} className='absolute w-full h-full bg-black/50 left-0 top-0 z-10'/>
      <div className='w-[270px] max-h-[270px] bg-main absolute top-2 p-3 translate-x-[-50px] rounded-[5px] z-[11] flex flex-col gap-1'>
        <div className='flex items-center gap-2 justify-end'>
          <Button 
          intent={'primary'}
          disabled={isCurrentMonth}
          className={`p-2 ${isCurrentMonth && 'text-gray-500'}`} 
          icon={<Icon name='common/arrow'  className='w-[8px] h-[8px]'/>} 
          onClick={() => handle(month - 1)}/>
          <button
          onClick={() => handle(dayjs().month())}
          disabled={isCurrentMonth}
          className={`text-[11px] font-bold text-accent ${isCurrentMonth && 'opacity-80'}`}>
            Today
          </button>
          <Button 
          intent={'primary'} 
          className='p-2'
          icon={<Icon name='common/arrow' className='rotate-180 translate-x-[1px] w-[8px] h-[8px]'/>} 
          onClick={() => handle(month + 1)}/>
        </div>
        <div className='space-y-1 w-full'>
          {date.map((item, id) => {
            return (
              <div 
              className='flex'
              key={id}>
                {
                  item.map(({date, month, year}) => {
                    const isToday = isCurrentMonth && dayjs().year() == year && dayjs().date() == date
                    const isCurrent = dayjs(currentDate).year() == year && dayjs(currentDate).date() == date && dayjs(currentDate).month() == month
                    const isPast = new Date(dayjs().year(), dayjs().month(), dayjs().date()) > new Date(year, month, date)
                    return (
                      <button key={`${date}/${month}/${year}`} 
                      onClick={() => changeDate(new Date(year, month, date))}
                      disabled={isPast || isCurrent}
                      className={`w-[35px] h-[35px] text-[13px] ${!isCurrent && !isPast && 'hover:bg-cHover'} 
                      flex items-center justify-center rounded-[5px] 
                      ${isPast && 'text-[#AAA]'} ${isToday && 'text-accent'}
                      ${isCurrent && 'bg-cFocus'}
                      `}>
                        {isToday 
                        ? <Icon name='common/filled-star'/>  
                        : <>{date}</>}
                      </button>
                    )
                  })
                }
              </div>
            )
          })}
      </div>
      </div>
    </>
  )
}