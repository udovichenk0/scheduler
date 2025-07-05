import { clsx } from "clsx"
import {
  PropsWithChildren,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react"
import { createPortal } from "react-dom"

import { focusTrap } from "@/shared/lib/key-utils/focus-trap"
import { isEsc } from "@/shared/lib/key-utils"
import { ClickOutsideLayer } from "@/shared/lib/click-outside"

import { Button, ButtonProps } from "../buttons/main-button"

import { useFocusGuards } from "./use-focus-guard"

type DefaultModalProps = {
  isOpened: boolean
  label: string
  focusAfterClose?: Nullable<RefObject<any>>
  portal?: boolean
  overlay?: boolean
  closeModal: () => void
}

type ModalProps = {
  children: ReactNode
} & DefaultModalProps

const ModalContext = createContext<DefaultModalProps>({
  isOpened: false,
  label: "",
  focusAfterClose: null,
  overlay: true,
  portal: true,
  closeModal: () => {},
})

const layers: RefObject<HTMLDivElement>[] = []

export const Modal = ({
  children,
  isOpened,
  label,
  focusAfterClose,
  overlay = true,
  portal = true,
  closeModal,
}: ModalProps) => {
  return (
    <ModalContext
      value={{ isOpened, label, focusAfterClose, overlay, portal, closeModal }}
    >
      {children}
    </ModalContext>
  )
}

export const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <button
      title="Close modal"
      onClick={close}
      className={
        "hover:bg-hover relative h-[22px] w-[22px] rounded-[4px] focus-visible:ring"
      }
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

const NewOverlay = () => {
  const { overlay } = useContext(ModalContext)

  if (!overlay) {
    return null
  }

  return (
    <div
      className={clsx(
        "absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-black/40",
      )}
    />
  )
}

const Header = ({ children, className }: DefaultProps) => {
  return (
    <div className={clsx("flex items-center px-2 pb-4", className)}>
      {children}
    </div>
  )
}

type ContentProps = DefaultProps & {
  initialFocus?: RefObject<any>
}

const Content = ({ children, className }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { isOpened } = useContext(ModalContext)

  if (!isOpened) {
    return null
  }

  return (
    <>
      <Portal>
        <NewOverlay />
        <DialogModal ref={ref} className={className}>
          {children}
        </DialogModal>
      </Portal>
    </>
  )
}

type DialogModalProps = {
  children: ReactNode
  ref: RefObject<any>
  className?: string
}

const DialogModal = ({ children, ref, className }: DialogModalProps) => {
  const { label, closeModal, focusAfterClose, portal } =
    useContext(ModalContext)

  useEffect(() => {
    return focusTrap(ref.current)
  }, [])

  useEffect(() => {
    layers.push(ref.current)
    return () => {
      layers.pop()
      if (focusAfterClose?.current.focus) {
        focusAfterClose.current.focus()
      }
    }
  }, [])

  useEscape({ onEscape: closeModal, modal: ref })

  useFocusGuards()

  const portalStyles = portal ? "left-1/2 top-1/2 -translate-1/2" : ""

  return (
    <ClickOutsideLayer
      onClickOutside={closeModal}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
      }}
      aria-label={label}
      data-part
      aria-modal
      role="dialog"
      className={clsx(
        "text-cFont border-cBorder bg-main animate-dialog absolute m-auto rounded-[5px] border-[1px] p-2", //!drop-shadow-base behaves like position relative
        portalStyles,
        className,
      )}
    >
      {children}
    </ClickOutsideLayer>
  )
}

const Portal = ({ children }: PropsWithChildren) => {
  const { portal } = useContext(ModalContext)
  if (!portal) return children
  return createPortal(children, document.body)
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

export const useEscape = ({
  onEscape,
  modal,
}: {
  onEscape: () => void
  modal: RefObject<any>
}) => {
  useEffect(() => {
    const onEscDown = (e: KeyboardEvent) => {
      if (isEsc(e)) {
        if (modal.current === layers[layers.length - 1]) {
          e.stopPropagation()
          onEscape()
        }
      }
    }

    document.addEventListener("keydown", onEscDown, true)

    return () => {
      document.removeEventListener("keydown", onEscDown, true)
    }
  }, [])
}

Modal.Header = Header
Modal.Content = Content
Modal.Trigger = Trigger
