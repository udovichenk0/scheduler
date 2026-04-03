import { cloneElement, isValidElement, ReactNode, RefObject } from "react"
import { Button, ButtonProps } from "../buttons/main-button"
import { mergeRefs } from "@/shared/lib/merge-refs"

type TriggerProps = ButtonProps & {
  asChild?: boolean
  className?: string
  children: ReactNode
  ref?: RefObject<Nullable<HTMLButtonElement>>
  triggerRef: RefObject<Nullable<HTMLButtonElement>>
}

export const DefaultTrigger = ({
  triggerRef,
  asChild = false,
  children,
  ref,
  ...rest
}: TriggerProps) => {
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...rest,
      ref: ref ? mergeRefs([triggerRef, ref]) : triggerRef,
    } as any)
  }

  return (
    <Button {...rest} ref={triggerRef}>
      {children}
    </Button>
  )
}
