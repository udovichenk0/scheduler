import { ForwardedRef, HTMLAttributes, ReactNode } from "react"

import { useClick } from "./use-click"

type ClickOutsideLayerProps = {
  onClickOutside: () => void
  children: ReactNode
  listenerOptions?: EventListenerOptions | boolean
  ref?: ForwardedRef<HTMLDivElement>
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
    <div
      {...rest}
      ref={ref}
      onPointerDown={(e) => {
        if (e.button != 0) return
        onPointerDown()
      }}
    >
      {children}
    </div>
  )
}
