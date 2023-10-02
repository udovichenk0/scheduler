import { RefObject, MouseEvent } from "react"

export const onClickOutside = (
  outRef: RefObject<HTMLElement>,
  e: MouseEvent,
  callback: () => void,
) => {
  if (outRef.current && !outRef.current.contains(e.target as Node)) {
    callback()
  }
}
