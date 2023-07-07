import { RefObject, MouseEvent } from "react"

export const onClickOutside = (outRef: RefObject<HTMLDivElement>, e: MouseEvent, callback: () => void) => {
  if(e.target === outRef.current){
    callback()
  }
}