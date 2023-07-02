import { Event, Store } from 'effector'
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
  statusChanged: Event<"FINISHED" | "INPROGRESS">, 
  descriptionChanged: Event<string>, 
  titleChanged: Event<string>,
  typeChanged: Event<{type: "inbox" | "unplaced"; date: Date | null}>
}


export const ModifyTaskForm = ({
  modifyTaskModel,
}:{
  modifyTaskModel: ModifyTaskFormType,
}) => {
  const [
    title, 
    description, 
    status,
    currentType,
    changeStatus,
    changeDescription,
    changeTitle,
    changeType
  ] = useUnit([
    modifyTaskModel.$title, 
    modifyTaskModel.$description, 
    modifyTaskModel.$status, 
    modifyTaskModel.$type,
    modifyTaskModel.statusChanged, 
    modifyTaskModel.descriptionChanged, 
    modifyTaskModel.titleChanged,
    modifyTaskModel.typeChanged
  ])
  const [isTypeOpened, setTypeOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const onClickOutside = (e: MouseEvent, ref: RefObject<HTMLDivElement>) => {
    if(e.target === ref.current){
      setTypeOpen(false)
    }
  }
  const onChangeType = (payload: {type: 'inbox' | 'unplaced', date: null | Date}) => {
    setTypeOpen(false)
    changeType(payload)
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
          <Button 
          onClick={() => setTypeOpen(prev => !prev)}
          icon={<Icon name={'common/inbox'} className="text-accent w-[18px] h-[18px]"/>} 
          title={capitalizeLetter(currentType)} 
          size={'sm'} 
          intent={'primary'}/>
          {isTypeOpened && 
          <TypeModal 
          outRef={ref} 
          currentType={currentType}
          changeType={onChangeType} 
          onClickOutside={(e) => onClickOutside(e, ref)}/>}
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}
