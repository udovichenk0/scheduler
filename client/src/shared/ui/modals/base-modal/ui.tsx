import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { MouseEvent, ReactNode, useRef } from "react"
import { createPortal } from "react-dom"

import { ModalType } from "@/shared/lib/modal"
interface ModalProps {
  children: ReactNode
  modal: ModalType
  title?: string
  className?: string
}

export const BaseModal = ({
  children,
  modal,
  title,
  className,
}: ModalProps) => {
  const [clickOutsideTriggered, toggleTriggered, isOpened] = useUnit([
    modal.clickOutsideTriggered,
    modal.toggleTriggered,
    modal.$isOpened,
  ])
  const ref = useRef<HTMLDivElement>(null)
  if (!isOpened) {
    return null
  }
  const handleOnClickOutside = (e: MouseEvent) => {
    if (e.target === ref.current) {
      clickOutsideTriggered()
    }
    e.stopPropagation()
  }
  return createPortal(
    <div
      ref={ref}
      onClick={handleOnClickOutside}
      className="absolute left-0 top-0 z-[1000] flex h-screen w-full items-center justify-center bg-black/40 text-primary"
    >
      <div
        className={clsx(
          "rounded-[5px] border-[1px] border-cBorder bg-main drop-shadow-[0_35px_35px_rgba(0,0,0,.56)]",
          className,
        )}
      >
        <div className={"m-2 flex justify-end"}>
          <span className="w-full pl-6 text-center text-[12px]">{title}</span>
          <button
            onClick={toggleTriggered}
            className={
              "relative h-[22px]  w-[22px] rounded-[4px] hover:bg-cHover"
            }
          >
            <span
              className={
                'before:absolute before:left-[5px] before:top-[10px] before:h-[1px] before:w-[12px] before:rotate-[-45deg] before:bg-cFont before:content-[""] after:absolute after:left-[5px] after:top-[10px] after:h-[1px] after:w-[12px] after:rotate-[45deg] after:bg-cFont after:content-[""]'
              }
            ></span>
          </button>
        </div>
        <div className={"mx-auto pb-6 pt-1"}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
