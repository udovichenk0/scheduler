import dayjs from 'dayjs'
import { Event as EffectorEvent, Store } from 'effector'
import { useUnit } from "effector-react"
import { useState, useRef } from "react"
import { capitalizeLetter } from "@/shared/lib/capitalize-letter"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { DatePicker } from './ui/date-picker'
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
  typeChanged: EffectorEvent<"inbox" | "unplaced">
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
  
  const onChangeType = (payload: 'inbox' | 'unplaced') => {
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
            <div className='flex'>
              {date && 
                <Button 
                onClick={() => setDatePickerOpen(prev => !prev)}
                icon={<Icon name={'common/upcoming'} className="text-accent w-[18px] h-[18px]"/>} 
                rightSlot={currentDate && <span className='text-accent'>{showDateTitle(currentDate)}</span>}
                title={'Date'} 
                size={'sm'} 
                intent={'primary'}/>
              }
            </div>
          </div>
          {isTypeOpened && 
          <TypeModal 
          outRef={ref} 
          currentType={currentType}
          changeType={onChangeType} 
          closeTypeModal={() => setTypeOpen(false)}/>}
          {isDatePickerOpened && 
          <DatePicker
          currentDate={currentDate || new Date()}
          outRef={ref}
          changeDate={onChangeDate}
          closeDatePicker={() => setDatePickerOpen(false)}
          />}
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function showDateTitle(date: Date) {
  const curDate = dayjs().date()
  const curMonth = dayjs().month()
  const curYear = dayjs().year()

  const dayjsDate = dayjs(date)
  const curYearAndMonth = curYear && curMonth
  if(dayjsDate.date() == curDate && curYearAndMonth){
    return 'Today'
  }
  else if(dayjsDate.date() == curDate + 1 && curYearAndMonth){
    return 'Tomorrow'
  }
  else if(dayjsDate.year() == curYear){
    return `${months[dayjsDate.month()]} ${dayjsDate.date()}`
  }
  else {
    return `${months[dayjsDate.month()]} ${dayjsDate.date()} ${dayjsDate.year()}`
  }
}