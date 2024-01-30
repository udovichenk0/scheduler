import clsx from "clsx"
import style from './style.module.css'
import { HTMLAttributes, ReactNode } from "react"

type Pos = 'top' | 'right' | 'left' | 'bottom'

interface Props extends HTMLAttributes<HTMLElement> {
  text: string,
  dir?: Pos
  children: ReactNode
}

export const Tooltip = ({ text, dir = 'top', children }: Props) => {
  return (
    <div className="relative group">
      {children}
      <span
        data-dir={dir}
        className={clsx(style.tooltip, 
        "max-w-[150px] hidden pointer-events-none bg-cCalendarTooltip text-ellipsis px-3 py-1 after:top-full after:absolute  after:left-1/2 after:-translate-x-1/2 after:border-x-[7px] after:border-t-[7px] after:border-x-transparent after:border-t-cCalendarTooltip group-hover:block")}>
          <span className="truncate text-primary  ">
            {text}
          </span>
      </span>
    </div>
  )
}