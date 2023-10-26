import { clsx } from "clsx"
import { Store, Event } from "effector"
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
  onClose: Event<void>
}) => {
  const [close, isOpened] = useUnit([onClose, $isOpened])
  const ref = useRef<HTMLDivElement>(null)
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