import dayjs from 'dayjs'
import { Event as EffectorEvent, Store } from 'effector'
import { useUnit } from "effector-react"
import { useState, useRef, RefObject, MouseEvent } from "react"
import { capitalizeLetter } from "@/shared/lib/capitalize-letter"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { TypeModal } from "./ui/type-modal"
type ModifyTaskFormType = {
  $title: Store<string>, 
  $description: Store<string>, 
  $status: Store<'FINISHED' | 'INPROGRESS'>, 
  $type: Store<'inbox' | 'unplaced'>,
  $startDate: Store<Date | null>,
  statusChanged: EffectorEvent<"FINISHED" | "INPROGRESS">, 
  descriptionChanged: EffectorEvent<string>, 
  titleChanged: EffectorEvent<string>,
  typeChanged: EffectorEvent<{type: "inbox" | "unplaced"; date: Date | null}>
  dateChanged: EffectorEvent<Date>
}

export const ModifyTaskForm = ({
  modifyTaskModel,
  date = true
}:{
  modifyTaskModel: ModifyTaskFormType,
  date?: boolean
}) => {
  const [
    title, 
    description, 
    status,
    currentType,
    currentDate,
    changeStatus,
    changeDescription,
    changeTitle,
    changeType,
    changeDate
  ] = useUnit([
    modifyTaskModel.$title, 
    modifyTaskModel.$description, 
    modifyTaskModel.$status, 
    modifyTaskModel.$type,
    modifyTaskModel.$startDate,
    modifyTaskModel.statusChanged, 
    modifyTaskModel.descriptionChanged, 
    modifyTaskModel.titleChanged,
    modifyTaskModel.typeChanged,
    modifyTaskModel.dateChanged,
  ])
  const [isTypeOpened, setTypeOpen] = useState(false)
  const [isDatePickerOpened, setDatePickerOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const onClickOutside = (e: MouseEvent, callback: () => void) => {
    if(e.target === ref.current){
      callback()
    }
  }
  
  const onChangeType = (payload: {type: 'inbox' | 'unplaced', date: null | Date}) => {
    setTypeOpen(false)
    changeType(payload)
  }
  const onChangeDate = (payload:Date) => {
    setDatePickerOpen(false)
    changeDate(payload)
  }
  return (
    <div className="flex gap-2 w-full rounded-[5px] text-sm">
      <Checkbox status={status} onChange={() => changeStatus(status)}/>
      <div className="flex flex-col w-full gap-3">
        <input 
          onChange={(e) => changeTitle(e.target.value)} 
          value={title} placeholder={title ? '' : 'New Task'} 
          className="w-full bg-transparent outline-none text-sm font-medium text-cFont dark:text-gray-300"/>
        <input className="w-full bg-transparent text-grey outline-none text-sm" 
          placeholder={description ? '' : 'Note'} 
          value={description || ''} 
          onChange={(e)   => changeDescription(e.target.value)}/>
        <div className="">
          <div className='flex flex-col gap-1'>
            <span>
              <Button 
              onClick={() => setTypeOpen(prev => !prev)}
              icon={<Icon name={'common/inbox'} className="text-accent w-[18px] h-[18px]"/>} 
              title={capitalizeLetter(currentType)} 
              size={'sm'} 
              intent={'primary'}/>
            </span>
            <span>
              {date && 
                <Button 
                onClick={() => setDatePickerOpen(prev => !prev)}
                icon={<Icon name={'common/upcoming'} className="text-accent w-[18px] h-[18px]"/>} 
                title={'Date'} 
                size={'sm'} 
                intent={'primary'}/>
              }
            </span>
          </div>
          {isTypeOpened && 
          <TypeModal 
          outRef={ref} 
          currentType={currentType}
          changeType={onChangeType} 
          onClickOutside={(e) => onClickOutside(e, () => setTypeOpen(false))}/>}
          {isDatePickerOpened && 
          <DatePicker
          currentDate={currentDate || new Date()}
          outRef={ref}
          changeDate={onChangeDate}
          onClickOutside={(e) => onClickOutside(e, () => setDatePickerOpen(false) )}/>}
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}



const changeMonth = (currentMonth = dayjs().month()) => {
  const year = dayjs().year()
  const firstDayOfMonth = dayjs(new Date(year, currentMonth, 1)).day()
  let current = 0 - firstDayOfMonth
  return new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      current+=1
      const currentDate = dayjs(new Date(year, currentMonth, current + 8))
      return {
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year()
      }
    })
  })
}


function DatePicker({
  outRef,
  currentDate,
  changeDate,
  onClickOutside
}:{
  outRef: RefObject<HTMLDivElement>,
  currentDate: Date,
  changeDate: (date: Date) => void
  onClickOutside: (e: MouseEvent) => void
}){
  const [date, setDate] = useState(changeMonth())
  const [month, setMonth] = useState(dayjs().month())
  const isCurrentMonth = dayjs().month() === month
  const handle = (month: number) => {
    console.log(month, dayjs().month())
    const currentMonth = dayjs().month()
    if(currentMonth <= month){
      setMonth(month)
      setDate(changeMonth(month))
    }
  }
  return (
    <>
    <div ref={outRef} onClick={onClickOutside} className='absolute w-full h-full bg-black/50 left-0 top-0 z-10'/>
    <div>
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
                        : <>{date}</>
                      }
                      </button>
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