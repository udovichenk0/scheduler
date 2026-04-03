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

type DefaultPopoverProps = {
  isOpened: boolean
  label: string
  focusAfterClose?: Nullable<RefObject<any>>
  portal?: boolean
  overlay?: boolean
  closeModal: () => void
}

type ContextProps = {
  triggerRef: RefObject<Nullable<any>>
  contentRef: RefObject<Nullable<HTMLDivElement>>
} & DefaultPopoverProps

type PopoverProps = {
  children: ReactNode
} & DefaultPopoverProps

const PopoverContext = createContext<ContextProps>({
  isOpened: false,
  label: "",
  focusAfterClose: null,
  overlay: true,
  portal: true,
  closeModal: () => {},
  triggerRef: { current: null },
  contentRef: { current: null },
})

export const Popover = ({
  children,
  isOpened,
  label,
  focusAfterClose,
  overlay = true,
  portal = true,
  closeModal,
}: PopoverProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <PopoverContext
      value={{
        isOpened,
        label,
        focusAfterClose,
        overlay,
        portal,
        closeModal,
        triggerRef,
        contentRef,
      }}
    >
      {children}
    </PopoverContext>
  )
}

const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <button
      title="Close popover"
      onClick={close}
      className={
        "hover:bg-hover absolute right-0 flex size-5 items-center justify-center rounded-sm focus-visible:ring"
      }
    >
      <Icon name="common/x" className="size-4" />
      <span className="sr-only">Close the popover</span>
    </button>
  )
}

type DefaultProps = {
  className?: string
  children: ReactNode
}

const NewOverlay = () => {
  const { overlay } = useContext(PopoverContext)

  if (!overlay) {
    return null
  }

  return (
    <div
      className={clsx(
        "absolute left-0 top-0 z-20 flex h-screen w-full items-center justify-center",
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
  const { isOpened, contentRef } = useContext(PopoverContext)

  if (!isOpened) {
    return null
  }

  return (
    <>
      <Portal>
        <NewOverlay />
        <DialogModal ref={contentRef} className={className} styles={styles}>
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
  const { label, closeModal, focusAfterClose, triggerRef, contentRef } =
    useContext(PopoverContext)
  const { push, pop } = useDisclosureLayer()
  useEffect(() => {
    return () => {}
  }, [])

  useEffect(() => {
    const triggerEl = triggerRef.current
    const contentEl = contentRef.current
    if (!triggerEl || !contentEl) return
    push(ref.current)

    const setPopoverPosition = () => {
      const triggerRect = triggerEl.getBoundingClientRect()
      contentEl.style.top = `${triggerRect.y + triggerRect.height}px`

      const contentWidth = contentEl.offsetWidth
      if (contentWidth + triggerRect.x > window.innerWidth) {
        const endContentX = contentWidth + triggerRect.x
        const endTriggerX = triggerRect.x + triggerRect.width
        const dx = endContentX - endTriggerX
        contentEl.style.left = `${triggerRect.x - dx}px`
        return
      }

      contentEl.style.left = `${triggerRect.x}px`
    }

    setPopoverPosition()

    const focusTrapUnsub = focusTrap(ref.current)

    const func = trottle(setPopoverPosition)
    window.addEventListener("resize", func)
    return () => {
      pop()
      focusTrapUnsub?.()

      if (focusAfterClose?.current.focus) {
        focusAfterClose.current.focus()
      } else if (triggerRef) {
        triggerRef.current?.focus()
      }

      window.removeEventListener("resize", func)
    }
  }, [])

  useEscape({ onEscape: closeModal, modal: ref })

  useFocusGuards()

  return (
    <ClickOutsideLayer
      onClickOutside={closeModal}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
      }}
      style={{ ...styles }}
      aria-label={label}
      data-part
      aria-modal
      role="dialog"
      className={clsx(
        "text-cFont border-cBorder bg-main animate-dialog absolute z-20 m-auto rounded-[5px] border p-2", //!drop-shadow-base behaves like position relative
        className,
      )}
    >
      {children}
    </ClickOutsideLayer>
  )
}

const Portal = ({ children }: PropsWithChildren) => {
  const { portal } = useContext(PopoverContext)
  if (!portal) return children
  return createPortal(children, document.body)
}

type TriggerProps = DefaultProps &
  ButtonProps & {
    asChild?: boolean
    className?: string
    children: ReactNode
    ref?: RefObject<any>
  }

const Trigger = ({ children, asChild = false, ...rest }: TriggerProps) => {
  const { triggerRef } = useContext(PopoverContext)

  return (
    <DefaultTrigger asChild={asChild} triggerRef={triggerRef} {...rest}>
      {children}
    </DefaultTrigger>
  )
}

const trottle = (func: () => void, time: number = 200) => {
  let timer: Nullable<NodeJS.Timeout> = null
  return () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      func()
      if (timer) clearTimeout(timer)
      timer = null
    }, time)
  }
}

Popover.Header = Header
Popover.Content = Content
Popover.Trigger = Trigger
Popover.CloseButton = CloseButton
