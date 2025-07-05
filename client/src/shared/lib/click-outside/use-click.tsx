import { useEffect, useId, useRef } from "react"
const stack: string[] = []
export const useClick = ({
  onClickOutside,
  listenerOptions = true,
}: {
  onClickOutside: () => void
  listenerOptions?: EventListenerOptions | boolean
}) => {
  const isPointerInsideReactTreeRef = useRef(false)
  const id = useId()
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target &&
        !isPointerInsideReactTreeRef.current &&
        id === stack[stack.length - 1]
      ) {
        e.stopPropagation()
        onClickOutside()
      } else {
        isPointerInsideReactTreeRef.current = false
      }
    }
    stack.push(id)
    document.addEventListener("click", close, listenerOptions)
    return () => {
      document.removeEventListener("click", close, listenerOptions)
      stack.pop()
    }
  }, [])

  return () => (isPointerInsideReactTreeRef.current = true)
}
