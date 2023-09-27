import { clsx } from "clsx"

import style from "./style.module.css"
export const PomodoroInput = ({
  value,
  onChange,
  className,
  onSubmit,
}: {
  value: number
  onChange: (value: string) => void
  className?: string
  onSubmit: (val: string) => void
}) => {
  return (
    <input
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
