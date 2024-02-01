import clsx from "clsx"
import style from './style.module.css'
import { HTMLAttributes, ReactNode } from "react"

type Pos = 'top' | 'right' | 'left' | 'bottom'
// top-center | top-right ...
type Pointer = 'tc' | 'tr' | 'tl' | 'bc' | 'br' | 'bl' 
type Size = 'base' | 'md'
interface Props extends HTMLAttributes<HTMLElement> {
  text: string,
  dir?: Pos,
  size?: Size,
  pointer?: Pointer,
  children: ReactNode
}

export const Tooltip = ({ text, dir = 'top', pointer = 'bc', size = 'base', children }: Props) => {
  return (
    <div className="relative group">
      {children}
      <span
        data-dir={dir}
        data-pointer={pointer}
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