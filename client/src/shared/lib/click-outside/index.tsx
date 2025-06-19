import { HTMLAttributes, ReactNode, RefObject } from "react"

import { useClick } from "./use-click"

type ClickOutsideLayerProps = {
  onClickOutside: () => void
  children: ReactNode
  listenerOptions?: EventListenerOptions | boolean
  ref?: RefObject<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const ClickOutsideLayer = ({
  onClickOutside,
  children,
  listenerOptions,
  ref,
  ...rest
}: ClickOutsideLayerProps) => {
  const onPointerDown = useClick({ onClickOutside, listenerOptions })
  return (
    <div {...rest} ref={ref} onPointerDown={onPointerDown}>
      {children}
    </div>
  )
}
