import { Event as EffectorEvent, Store } from 'effector'
import { useUnit } from "effector-react"
import { useState, useRef } from "react"
import { capitalizeLetter } from "@/shared/lib/capitalize-letter"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { showDateTitle } from './lib/display-date-info'
import { DateModal } from './ui/date-modal'
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

  console.log(currentDate)
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
              size={'sm'} 
              intent={'primary'}>
                <div className='flex gap-4'>
                  <Icon name={'common/inbox'} className="text-accent w-[18px] h-[18px]"/>
                  {capitalizeLetter(currentType)}
                </div>
              </Button>
            </span>
            <div className='flex'>
              {date && 
                <Button 
                onClick={() => setDatePickerOpen(prev => !prev)}
                size={'sm'} 
                intent={'primary'}>
                  <div className='flex'>
                    <Icon name={'common/upcoming'} className="text-cTaskEditDefault w-[18px] mr-4 h-[18px]"/>
                    <span>Date</span>
                    <span className='text-accent ml-2'>
                      {currentDate && showDateTitle(currentDate)}
                    </span>
                  </div>
                </Button>
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
          <DateModal
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