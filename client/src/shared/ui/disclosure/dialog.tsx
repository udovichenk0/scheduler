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
import { ClickOutsideLayer } from "@/shared/lib/click-outside"

import { ButtonProps } from "../buttons/main-button"
import { Icon } from "../icon"
import { useFocusGuards } from "@/shared/lib/use-focus-guard"
import { useDisclosureLayer } from "./layer"
import { useEscape } from "./use-disclosure-escape"
import { DefaultTrigger } from "./default-trigger"

type DefaultDialogProps = {
  isOpened: boolean
  label: string
  focusAfterClose?: Nullable<RefObject<any>>
  portal?: boolean
  overlay?: boolean
  popup?: boolean
  closeDialog: () => void
  asChild?: boolean
}

type ContextProps = {
  triggerRef: RefObject<Nullable<any>>
} & DefaultDialogProps

type DialogProps = {
  children: ReactNode
} & DefaultDialogProps

const DialogContext = createContext<ContextProps>({
  isOpened: false,
  label: "",
  focusAfterClose: null,
  overlay: true,
  portal: true,
  popup: false,
  closeDialog: () => {},
  triggerRef: { current: null },
  asChild: false,
})

export const Dialog = ({
  children,
  isOpened,
  label,
  focusAfterClose,
  overlay = true,
  portal = true,
  popup = false,
  asChild,
  closeDialog,
}: DialogProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <DialogContext
      value={{
        isOpened,
        label,
        focusAfterClose,
        overlay,
        portal,
        closeDialog: closeDialog,
        popup,
        asChild,
        triggerRef,
      }}
    >
      {children}
    </DialogContext>
  )
}

const CloseButton = () => {
  const { closeDialog } = useContext(DialogContext)
  return (
    <button
      title="Close Window"
      onClick={closeDialog}
      className={
        "hover:bg-hover absolute right-0 flex size-5 items-center justify-center rounded-sm focus-visible:ring"
      }
    >
      <Icon name="common/x" className="size-4" />
      <span className="sr-only">Close Window</span>
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
        `text-cFont w-full data-[pos=left]:text-left data-[pos=center]:text-center data-[font=lg]:text-base data-[font=md]:text-sm data-[font=xs]:text-xs`,
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
  const { overlay } = useContext(DialogContext)

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
  const { isOpened } = useContext(DialogContext)

  if (!isOpened) {
    return null
  }

  return (
    <>
      <Portal>
        <NewOverlay />
        <DialogContent ref={ref} className={className} styles={styles}>
          {children}
        </DialogContent>
      </Portal>
    </>
  )
}

type DialogContentProps = {
  children: ReactNode
  ref: RefObject<any>
  className?: string
  styles?: React.CSSProperties
}

const DialogContent = ({
  children,
  ref,
  className,
  styles,
}: DialogContentProps) => {
  const { label, closeDialog, focusAfterClose, portal, popup, triggerRef } =
    useContext(DialogContext)
  const { push, pop } = useDisclosureLayer()

  useEffect(() => {
    return focusTrap(ref.current)
  }, [])

  useEffect(() => {
    push(ref.current)
    return () => {
      pop()
      if (focusAfterClose?.current?.focus) {
        focusAfterClose.current.focus()
      } else if (triggerRef?.current) {
        triggerRef.current?.focus()
      }
    }
  }, [])

  useEscape({ onEscape: closeDialog, modal: ref })

  useFocusGuards()

  const portalStyles = portal && !popup ? "left-1/2 top-1/2 -translate-1/2" : ""

  return (
    <ClickOutsideLayer
      onClickOutside={closeDialog}
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
        "text-cFont border-cBorder bg-main animate-dialog absolute z-20 m-auto rounded-[5px] border p-2", //!drop-shadow-base behaves like position relative
        portalStyles,
        className,
      )}
    >
      {children}
    </ClickOutsideLayer>
  )
}

const Portal = ({ children }: PropsWithChildren) => {
  const { portal } = useContext(DialogContext)
  if (!portal) return children
  return createPortal(children, document.body)
}

type TriggerProps = DefaultProps &
  Omit<ButtonProps, "onClick"> & {
    onClick: () => void
    ref?: RefObject<any>
  }

const Trigger = ({ children, onClick, ...rest }: TriggerProps) => {
  const { triggerRef, asChild } = useContext(DialogContext)
  return (
    <DefaultTrigger asChild={asChild} triggerRef={triggerRef} {...rest}>
      {children}
    </DefaultTrigger>
  )
}

Dialog.Header = Header
Dialog.Content = Content
Dialog.Trigger = Trigger
Dialog.Title = Title
Dialog.CloseButton = CloseButton
