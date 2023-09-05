import { clsx } from "clsx"

import { DoneSvg } from "./done.svg"
import "./style.css"
export function Checkbox({
  onChange,
  checked,
  className,
  iconClassName,
}: {
  onChange: () => void
  checked: boolean
  className?: string
  iconClassName?: string
}) {
  return (
    <label className="group relative flex">
      <input
        onChange={onChange}
        type="checkbox"
        className="checkbox_input appearance-none"
      />
      <span
        className={clsx(
          className,
          "checkbox flex h-5 w-5 items-center justify-center rounded-[3px] border-[2px] border-cTaskEditDefault",
        )}
      >
        {checked && <DoneSvg className={clsx(iconClassName, "checker")} />}
      </span>
    </label>
  )
}
