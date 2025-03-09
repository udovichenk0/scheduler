import { clsx } from "clsx"
import { useEffect, useRef } from "react"

import style from "./style.module.css"
export const PomodoroInput = ({
  value,
  onChange,
  className,
  onSubmit,
  autoFocus = false
}: {
  value: number
  onChange: (value: string) => void
  className?: string
  onSubmit: (val: string) => void
  autoFocus?: boolean
}) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if(autoFocus){
      ref?.current?.focus()
    }
  }, [autoFocus])
  return (
    <input
      ref={ref}
      onBlur={(e) => onSubmit(e.target.value)}
      className={clsx(
        style.removeArrow,
        "w-16 appearance-none rounded-[5px] border border-cSecondBorder bg-transparent text-center",
        className,
      )}
      maxLength={3}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  )
}
