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
    <label className="relative flex">
      <input
        tabIndex={-1}
        onChange={() => onChange()}
        checked={checked}
        type="checkbox"
        id="checkbox"
        className={clsx(
          `h-5 w-5  appearance-none rounded-[2px] border-[3px] border-cTaskEditDefault`,
          className,
        )}
      />
      <span
        id="check"
        className="pointer-events-none absolute left-[5px] top-[5px] hidden"
      >
        <DoneSvg className={iconClassName} />
      </span>
    </label>
  )
}
