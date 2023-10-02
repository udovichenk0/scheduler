import { RefObject, MouseEvent } from "react"

export function clickOnElement(
  ref: RefObject<HTMLDivElement>,
  e: MouseEvent,
  callback: () => void,
) {
  if (ref.current == e.target) {
    callback()
  }
  return
}
