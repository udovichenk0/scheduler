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
import { Icon } from "../icon"

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

const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <button
      title="Close modal"
      onClick={close}
      className={
        "hover:bg-hover absolute right-0 flex size-5 items-center justify-center rounded-[4px] focus-visible:ring"
      }
    >
      <Icon name="common/x" className="size-4" />
      <span className="sr-only">Close the modal</span>
    </button>
  )
}

export const Title = ({
  children,
  pos = "center",
  fontSize = "xs",
  className,
}: {
  children: ReactNode
  pos?: "left" | "center"
  fontSize?: "xs" | "md" | "lg"
  className?: string
}) => {
  return (
    <h2
      data-pos={pos}
      data-font={fontSize}
      className={clsx(
        `
            text-cFont
            w-full
            data-[pos=left]:text-left
            data-[pos=center]:text-center
            data-[font=lg]:text-base
            data-[font=md]:text-sm data-[font=xs]:text-xs`,
        className,
      )}
    >
      {children}
    </h2>
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
        "absolute left-0 top-0 z-20 flex h-screen w-full items-center justify-center bg-black/40",
      )}
    />
  )
}

const Header = ({ children, className }: DefaultProps) => {
  return (
    <div className={clsx("relative flex items-center py-1 pb-4", className)}>
      {children}
    </div>
  )
}

type ContentProps = DefaultProps & {
  initialFocus?: RefObject<any>
  styles?: React.CSSProperties
}

const Content = ({ children, className, styles }: ContentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { isOpened } = useContext(ModalContext)

  if (!isOpened) {
    return null
  }

  return (
    <>
      <Portal>
        <NewOverlay />
        <DialogModal ref={ref} className={className} styles={styles}>
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
  styles?: React.CSSProperties
}

const DialogModal = ({
  children,
  ref,
  className,
  styles,
}: DialogModalProps) => {
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
      style={styles}
      aria-label={label}
      data-part
      aria-modal
      role="dialog"
      className={clsx(
        "text-cFont border-cBorder bg-main animate-dialog absolute z-20 m-auto rounded-[5px] border-[1px] p-2", //!drop-shadow-base behaves like position relative
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
Modal.Title = Title
Modal.CloseButton = CloseButton
