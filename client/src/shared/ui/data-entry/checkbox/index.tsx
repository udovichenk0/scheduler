import { clsx } from "clsx"
import "./style.css"
import { RefObject } from "react"

import { isEnter, isSpace } from "@/shared/lib/key-utils"

import { DoneSvg } from "./done.svg"

export function Checkbox({
  onChange,
  checked,
  className,
  borderClassName,
  iconClassName,
  ref,
  disabled,
}: {
  onChange: () => void
  checked: boolean
  className?: string
  borderClassName?: string
  iconClassName?: string
  ref?: RefObject<any>
  disabled?: boolean
}) {
  return (
    <label 
      onClick={(e) => {
        e.preventDefault()
        onChange()
      }}
      className={clsx(className, "flex")}>
      <input
        ref={ref}
        disabled={disabled}
        aria-checked={checked}
        onKeyDown={(e) => {
          if (isEnter(e) || isSpace(e)) {
            e.stopPropagation()
            onChange()
          }
        }}
        type="checkbox"
        className="checkbox_input h-0 appearance-none"
      />
      <span
        className={clsx(
          borderClassName,
          "checkbox border-cTaskEditDefault flex h-5 w-5 items-center justify-center rounded-[3px] border-[2px]",
        )}
      >
        {checked && <DoneSvg className={clsx(iconClassName, "checker")} />}
      </span>
    </label>
  )
}
