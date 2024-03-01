import clsx from "clsx"
import style from './style.module.css'
import { HTMLAttributes, ReactNode } from "react"

// top-center | top-right ...
type Dir = 'tc' | 'tr' | 'tl' | 'bc' | 'br' | 'bl' 
type Size = 'base' | 'md'
interface Props extends HTMLAttributes<HTMLElement> {
  text: string,
  dir?: Dir,
  size?: Size,
  children: ReactNode
}

export const Tooltip = ({ text, dir = 'tc', size = 'base', children }: Props) => {
  return (
    <div className="relative group sdf">
      {children}
      <span
        data-dir={dir}
        className={clsx(style.tooltip, 
        "max-w-[150px] hidden bg-cCalendarTooltip text-ellipsis px-3 py-1 group-hover:block")}>
          <div
          data-size={size}
          className={clsx(style.size, "truncate text-cTooltipFont")}>
            {text}
          </div>
      </span>
    </div>
  )
}