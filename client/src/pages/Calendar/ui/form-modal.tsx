import { clsx } from "clsx"
import { Store, EventCallable } from "effector"
import { useUnit } from "effector-react"
import { ReactNode, useRef, MouseEvent } from "react"
import { createPortal } from "react-dom"

export const TaskFormModal = ({
  children,
  className,
  $isOpened,
  onClose,
}: {
  children: ReactNode
  className?: string
  $isOpened: Store<boolean>
  onClose: EventCallable<void>
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const close = useUnit(onClose)
  const isOpened = useUnit($isOpened)

  if (!isOpened) {
    return null
  }
  const handleOnClickOutside = (e: MouseEvent) => {
    if (e.target === ref.current) {
      close()
    }
    e.stopPropagation()
  }
  return createPortal(
    <div
      ref={ref}
      onClick={handleOnClickOutside}
      className="absolute left-0 top-0 z-[999] flex h-screen w-full items-center justify-center bg-black/40 text-primary"
    >
      <div
        className={clsx(
          "rounded-[5px] border-[1px] border-cBorder bg-main drop-shadow-base",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
