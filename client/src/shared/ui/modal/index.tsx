import { clsx } from "clsx"
import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react"

import { focusTrap } from "@/shared/lib/key-utils/focus-trap"

import { Button, ButtonProps } from "../buttons/main-button"

interface ModalProps {
  children: ReactNode
  className?: string
  isOpened: boolean
  closeModal: () => void
  label: string
  focusAfterClose?: Nullable<RefObject<any>>
}

type Context = {
  isOpened: boolean
  label: string
  focusAfterClose?: Nullable<RefObject<any>>
  closeModal: () => void
}

const ModalContext = createContext<Context>({
  isOpened: false,
  label: "",
  focusAfterClose: null,
  closeModal: () => {},
})

export const Modal = ({
  children,
  isOpened,
  closeModal,
  label,
  focusAfterClose = null,
}: ModalProps) => {
  return (
    <ModalContext value={{ isOpened, label, closeModal, focusAfterClose }}>
      {children}
    </ModalContext>
  )
}

export const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <button
      title={"Close modal"}
      onClick={close}
      className={"hover:bg-hover relative h-[22px] w-[22px] rounded-[4px]"}
    >
      <span
        className={
          'before:bg-cFont after:bg-cFont before:absolute before:left-[5px] before:top-[10px] before:h-[1px] before:w-[12px] before:rotate-[-45deg] before:content-[""] after:absolute after:left-[5px] after:top-[10px] after:h-[1px] after:w-[12px] after:rotate-[45deg] after:content-[""]'
        }
      ></span>
      <span className="sr-only">Close the modal</span>
    </button>
  )
}

type DefaultProps = {
  className?: string
  children: ReactNode
}

const Overlay = ({ children, className }: DefaultProps) => {
  const { isOpened } = useContext(ModalContext)

  if (!isOpened) {
    return null
  }

  return (
    <div
      className={clsx(
        "absolute left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/40",
        className,
      )}
    >
      {children}
    </div>
  )
}

const Header = ({ children, className }: DefaultProps) => {
  return (
    <div className={clsx("flex items-center p-2", className)}>{children}</div>
  )
}

type ContentProps = DefaultProps & {
  initialFocus?: RefObject<any>
}

const Content = ({ children, className }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    return focusTrap(ref.current)
  }, [])
  return (
    <div ref={ref} data-part className={clsx("mx-auto pb-6 pt-1", className)}>
      {children}
    </div>
  )
}

const Body = ({ children, className }: DefaultProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { label, closeModal, focusAfterClose, isOpened } =
    useContext(ModalContext)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (ref.current && !ref.current.contains(target)) {
        // e.stopPropagation()
        closeModal()
      }
    }

    if (isOpened) {
      document.addEventListener("click", close, true)
    }
    return () => {
      if (isOpened) {
        document.removeEventListener("click", close, true)
        if (
          focusAfterClose &&
          focusAfterClose.current &&
          focusAfterClose.current.focus
        ) {
          focusAfterClose.current.focus()
        }
      }
    }
  }, [isOpened])

  if (!isOpened) {
    return null
  }

  return (
    <div
      ref={ref}
      id="mymodal"
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      aria-modal
      role="dialog"
      className={clsx(
        "border-cBorder bg-main animate-dialog rounded-[5px] border-[1px]", //!drop-shadow-base behaves like position relative
        className,
      )}
    >
      {children}
    </div>
  )
}

type TriggerProps = DefaultProps &
  Omit<ButtonProps, "onClick"> & {
    onClick: () => void
  }

const Trigger = ({ children, onClick, ...rest }: TriggerProps) => {
  return (
    <Button {...rest} onClick={onClick}>
      {children}
    </Button>
  )
}

Modal.Header = Header
Modal.Content = Content
Modal.Overlay = Overlay
Modal.Body = Body
Modal.Trigger = Trigger
