import { Button } from "@/shared/ui/buttons/main-button"
import clsx from "clsx"
import { HTMLAttributes, ReactNode, RefObject } from "react"

export const Cell = ({
  children,
  onClick,
  className,
  active = false,
  ref,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  active?: boolean
  ref?: RefObject<HTMLDivElement>
} & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <div ref={ref} className={clsx("h-full", className)}>
      <Button
        data-active={active}
        onClick={onClick}
        intent="borderOutline"
        className={clsx(
          "min-w-45 hover:border-cSecondBorder/30! data-[active=true]:border-accent/80! relative inline-flex h-full items-center gap-x-1 px-4 text-start",
        )}
      >
        {children}
      </Button>
    </div>
  )
}
