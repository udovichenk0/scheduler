import { RefObject, MouseEvent } from "react"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon, IconName } from "@/shared/ui/icon"

type T = {
  type: 'inbox' | 'unplaced',
  date: null | Date,
  iconName: IconName
}
const types:T[] = [
  {type: 'inbox' as const, date: null, iconName: 'common/inbox'},
  {type: 'unplaced' as const, date: new Date(), iconName: 'common/inbox'}
]

export const TypeModal = ({
  onClickOutside, 
  outRef,
  currentType,
  changeType
}:{
  onClickOutside: (e: MouseEvent) => void,
  outRef: RefObject<HTMLDivElement>,
  currentType: 'inbox' | 'unplaced',
  changeType: (payload: {type: 'inbox' | 'unplaced', date: null | Date}) => void
}) => {
  return (
    <>
      <div ref={outRef} onClick={(e) => onClickOutside(e)} className="absolute w-full h-full bg-black/50 left-0 top-0 z-10"/>
      <div className="w-[280px] bg-main absolute p-3 rounded-[5px] z-[11] flex flex-col gap-1">
        {types.map(({type, date, iconName}, id) => {
          const active = type == currentType
          return (
            <Button 
            icon={<Icon name={iconName} className={`text-accent w-5 h-5 ${active && 'text-cFocusSecond'}`}/>}
            key={id} 
            title={type} 
            size={'xs'} 
            onClick={() => changeType({type, date})}
            className={`w-full ${active && 'bg-cFocus hover:!bg-cFocus'}`} intent={'primary'}/>
          )
        })}
      </div>
    </>
  )
}