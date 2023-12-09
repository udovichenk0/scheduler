import { RefObject, useEffect } from "react"

export const onClickOutside = (
  outRef: RefObject<HTMLElement>,
  e: React.MouseEvent,
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
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        callback()
      }
    }
    document.addEventListener("click", onClickOutside)
    return () => {
      document.removeEventListener("click", onClickOutside)
    }
  }, deps)
}
