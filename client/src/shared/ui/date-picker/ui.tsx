import dayjs from "dayjs"
import { useState } from "react"
import { changeMonth } from "@/shared/lib/change-month"
import { Icon } from "../icon"

const daysName = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function DatePicker({
  currentDate,
  onDateChange
}:{
  currentDate: Date,
  onDateChange: (date: Date) => void
}){
  const [dates, setDate] = useState(changeMonth())
  const [displayedMonth, setDisplayedMonth] = useState(dayjs().month())
  const currentSetMonth = dayjs(new Date(dayjs().year(), displayedMonth, dayjs().date())).month()
  const isCurrentMonth = dayjs().month() === displayedMonth
  const switchMonth = (month: number) => {
    if(dayjs().month() <= month){
      setDisplayedMonth(month)
      setDate(changeMonth(month))
    }
  }
  return (
    <>
        <div className='flex items-center gap-2 justify-end text-primary'>
          <button 
          disabled={isCurrentMonth}
          onClick={() => switchMonth(displayedMonth - 1)}
          className={`${isCurrentMonth && 'opacity-50'} rotate-180 outline-none rounded-[5px] flex items-center justify-center w-6 h-6 p-2 transition-colors duration-150 hover:bg-cHover text-primary text-sm`}>
            <Icon name='common/arrow'  className='w-[8px] h-[8px]'/>
          </button>

          <button
            onClick={() => switchMonth(dayjs().month())}
            disabled={isCurrentMonth}
            className={`text-[11px] font-bold text-accent ${isCurrentMonth && 'opacity-80'}`}>
            Today
          </button>

          <button 
          onClick={() => switchMonth(displayedMonth + 1)}
          className="outline-none rounded-[5px] flex items-center justify-center w-6 h-6 p-2 transition-colors duration-150 hover:bg-cHover text-primary text-sm">
            <Icon name='common/arrow'  className='translate-x-[1px] w-[8px] h-[8px]'/>
          </button>
        </div>
        <div className='w-full'>
          <div className='grid grid-cols-7 border-b-[1px] border-cBorder text-primary'>
            {daysName.map((name) => {
              return (
                <div className="text-[12px] py-2 justify-self-center" key={name}>
                  {name}
                </div>
              )
            })}
          </div>
          <div className='relative text-primary'>
            <span className="absolute top-[30%] left-[30%] -z-[10] text-main invert opacity-10 font-bold text-[90px]">
              {currentSetMonth + 1 < 10 ? `0${currentSetMonth + 1}` : currentSetMonth + 1}
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
                          onClick={() => onDateChange(new Date(year, month, date))}
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
    </>
  )
}