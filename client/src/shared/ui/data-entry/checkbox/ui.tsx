import { clsx } from "clsx"

import { DoneSvg } from "./done.svg"
import "./style.css"
export function Checkbox({
  onChange,
  checked,
  className,
  borderClassName,
  iconClassName,
}: {
  onChange: () => void
  checked: boolean
  className?: string
  borderClassName?: string
  iconClassName?: string
}) {
  return (
    <label className={clsx(className, "flex")}>
      <input
        onChange={onChange}
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
