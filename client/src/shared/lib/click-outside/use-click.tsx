import { useEffect, useRef } from "react"

export const useClick = ({
  onClickOutside, 
  listenerOptions = true
}: {
  onClickOutside: () => void, 
  listenerOptions?: EventListenerOptions | boolean
}) => {
  const isPointerInsideReactTreeRef = useRef(false)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if(target && !isPointerInsideReactTreeRef.current){
        e.stopPropagation()
        onClickOutside()
      } else {
        isPointerInsideReactTreeRef.current = false
      }
    }
    document.addEventListener("click", close, listenerOptions)
    return () => {
      document.removeEventListener("click", close, listenerOptions)
    }
  }, [])
  
  return () => isPointerInsideReactTreeRef.current = true
}