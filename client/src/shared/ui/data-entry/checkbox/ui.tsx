import { clsx } from "clsx"

import { DoneSvg } from "./done.svg"
import "./style.css"
import { RefObject } from "react"
import { isEnter, isSpace } from "@/shared/lib/key-utils"
export function Checkbox({
  onChange,
  checked,
  className,
  borderClassName,
  iconClassName,
  ref,
  disabled
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
    <label className={clsx(className, "flex")}>
      <input
        ref={ref}
        disabled={disabled}
        aria-checked={checked}
        onKeyDown={(e) => {
          if(isEnter(e) || isSpace(e)){
            e.stopPropagation()
            onChange()
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          onChange()
        }}
        type="checkbox"
        className="checkbox_input h-0 appearance-none"
      />
      <span
        className={clsx(
          borderClassName,
          "checkbox flex h-5 w-5 items-center justify-center rounded-[3px] border-[2px] border-cTaskEditDefault",
        )}
      >
        {checked && <DoneSvg className={clsx(iconClassName, "checker")} />}
      </span>
    </label>
  )
}
