import { RefObject, useEffect } from "react"

export const onClickOutside = (
  outRef: RefObject<HTMLElement>,
  e: MouseEvent,
  callback: () => void,
) => {
  if (outRef.current && !outRef.current.contains(e.target as Node)) {
    callback()
  }
}

type UseClickOutsideProps = {
  callback: () => void
  deps: unknown[]
  ref: RefObject<HTMLElement>
}
export const useClickOutside = (props: UseClickOutsideProps) => {
  const { callback, deps, ref } = props
  useEffect(() => {
    const closeFilter = (e: MouseEvent) => {
      if (!(ref.current)?.contains(e.target as Node)) {
        callback()
      }
    }
      document.addEventListener("click", closeFilter)
    return () => {
      document.removeEventListener("click", closeFilter)
    }
  }, deps)
}