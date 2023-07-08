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
  const [dates, setDate] = useState(changeMonth())
  const [count, setCount] = useState(dayjs().month())
  const currentSetMonth = dayjs(new Date(dayjs().year(), count, dayjs().date())).month() + 1

  const isCurrentMonth = dayjs().month() === count
  const handle = (month: number) => {
    if(dayjs().month() <= month){
      setCount(month)
      setDate(changeMonth(month))
    }
  }
  const daysName = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return (
    <>
    <div ref={outRef} onClick={(e) => onClickOutside(outRef, e, closeDatePicker)} className='absolute w-full h-full bg-black/50 left-0 top-0 z-10'/>
      <div className='w-[270px] border-[1px] border-cBorder bg-main absolute top-2 p-3 translate-x-[-50px] rounded-[5px] z-[11] flex flex-col gap-1'>
        <div className='flex items-center gap-2 justify-end'>
          <Button 
          intent={'primary'}
          disabled={isCurrentMonth}
          className={`p-2 ${isCurrentMonth && 'text-gray-500'}`} 
          icon={<Icon name='common/arrow'  className='w-[8px] h-[8px]'/>} 
          onClick={() => handle(count - 1)}/>
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
          onClick={() => handle(count + 1)}/>
        </div>
        <div className='w-full'>
          <div className='grid grid-cols-7 border-b-[1px] border-cBorder'>
            {daysName.map((name) => {
              return (
                <div className="text-[12px] py-2 justify-self-center" key={name}>
                  {name}
                </div>
              )
            })}
          </div>
          <div className='relative'>
            <span className="absolute top-[30%] left-[30%] -z-[10] text-main invert opacity-10 font-bold text-[90px]">
              {currentSetMonth < 10 ? `0${currentSetMonth}` : currentSetMonth}
            </span>
            {dates.map((item, rowId) => {
              return (
                <div 
                className='grid grid-cols-7'
                key={rowId}>
                  {
                    item.map(({date, month, year}, id) => {
                      const isTopDateBigger = rowId != dates.length - 1 && dates[rowId][id].date > dates[rowId + 1][id].date
                      const isLeftDateBigger = id != item.length - 1 && dates[rowId][id].date > dates[rowId][id + 1].date
                      const isToday = isCurrentMonth && dayjs().year() == year && dayjs().date() == date
                      const isCurrent = dayjs(currentDate).year() == year && dayjs(currentDate).date() == date && dayjs(currentDate).month() == month
                      const isPast = new Date(dayjs().year(), dayjs().month(), dayjs().date()) > new Date(year, month, date)
                      return (
                        <div 
                        className={`w-full py-[2px] ${isTopDateBigger && 'border-b-[1px] border-cBorder'} ${isLeftDateBigger && 'border-r-[1px] border-b-[1px] border-cBorder'}`}
                        key={`${date}/${month}/${year}`}>
                          <button 
                          onClick={() => changeDate(new Date(year, month, date))}
                          disabled={isPast || isCurrent}
                          className={`w-[35px] h-[35px] text-[13px] ${!isCurrent && !isPast && 'hover:bg-cHover'} 
                          flex items-center justify-center rounded-[5px] 
                          ${isPast && 'text-[#AAA]'} ${isToday && 'text-accent'}
                          ${isCurrent && 'bg-cFocus'}
                          `}>
                            {isToday ? <Icon name='common/filled-star'/>  
                            : <div>{date === 1 ?
                              <div className="text-[9px] leading-[9px] grid">
                                <div>{date}</div>
                                <span>{months[month]}</span>
                              </div>
                              : <span>
                                {date}
                              </span>
                            }</div>}
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })}
          </div>
      </div>
      </div>
    </>
  )
}