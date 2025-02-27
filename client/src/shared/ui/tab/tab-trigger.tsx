import { clsx } from "clsx"
import { ButtonHTMLAttributes, MouseEvent, ReactNode, useContext } from "react"

import { TabContext } from "./tab.model"

type TriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
  className?: string
  activeClass?: string
  children: ReactNode
  onClick?: (e: MouseEvent, value: string) => void
}

export function Trigger({
  className,
  value,
  activeClass,
  children,
  onClick,
  ...props
}: TriggerProps) {
  const { value: currentValue, setValue } = useContext(TabContext)
  return (
    <button
      {...props}
      onClick={(e) => {
        setValue(value)
        if(onClick) onClick(e, value)
      }}
      className={clsx(className, currentValue == value && activeClass, "focus-visible:text-accent")}
    >
      {children}
    </button>
  )
}
