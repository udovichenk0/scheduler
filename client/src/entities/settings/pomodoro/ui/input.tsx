import { clsx } from "clsx"

import style from "./style.module.css"
export const PomodoroInput = ({
  value,
  onChange,
  className,
  onSubmit,
}: {
  value: number
  onChange: (value: number) => void
  className?: string
  onSubmit: (val: string) => void
}) => {
  return (
    <input
      onBlur={(e) => onSubmit(e.target.value)}
      className={clsx(
        style.removeArrow,
        "w-16 appearance-none rounded-[5px] border-2 border-cSecondBorder bg-transparent text-center",
        className,
      )}
      type="number"
      onChange={(e) => onChange(+e.target.value)}
      value={value}
    />
  )
}