import clsx from "clsx"
import { HTMLAttributes, ReactNode } from "react"

import style from "./style.module.css"

// top-center | top-right ...
type Dir = "tc" | "tr" | "tl" | "bc" | "br" | "bl"
type Size = "base" | "md"
interface Props extends HTMLAttributes<HTMLElement> {
  text: string
  dir?: Dir
  size?: Size
  children: ReactNode
  containerClassName?: string
}

export const Tooltip = ({
  text,
  dir = "tc",
  size = "base",
  children,
}: Props) => {
  return (
    <div className="group relative">
      {children}
      <div
        data-dir={dir}
        className={clsx(
          style.tooltip,
          "bg-cCalendarTooltip hidden max-w-[150px] select-none text-ellipsis rounded-[5px] px-3 py-1 group-hover:block",
        )}
      >
        <div
          data-size={size}
          className={clsx(style.size, "text-cTooltipFont truncate")}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
