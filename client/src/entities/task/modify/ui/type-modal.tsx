import { RefObject } from "react"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

const types = [
  {type: 'inbox' as const, iconName: 'common/inbox' as const},
  {type: 'unplaced' as const, iconName: 'common/inbox' as const}
]

export const TypeModal = ({
  closeTypeModal, 
  outRef,
  currentType,
  changeType
}:{
  closeTypeModal: () => void,
  outRef: RefObject<HTMLDivElement>,
  currentType: 'inbox' | 'unplaced',
  changeType: (payload: "inbox" | "unplaced") => void
}) => {
  return (
    <>
      <div ref={outRef} onClick={(e) => onClickOutside(outRef, e, closeTypeModal)} className="absolute w-full h-full bg-black/50 left-0 top-0 z-10"/>
      <div className="w-[280px] bg-main absolute -translate-y-[30px] p-3 rounded-[5px] z-[11] flex flex-col gap-1">
        {types.map(({type, iconName}, id) => {
          const active = type == currentType
          return (
            <Button 
            icon={<Icon name={iconName} className={`text-accent w-5 h-5 ${active && 'text-cFocusSecond'}`}/>}
            key={id} 
            title={type} 
            size={'xs'} 
            onClick={() => changeType(type)}
            className={`w-full ${active && 'bg-cFocus hover:!bg-cFocus'}`} intent={'primary'}/>
          )
        })}
      </div>
    </>
  )
}