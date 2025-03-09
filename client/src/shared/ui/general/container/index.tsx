import { clsx } from "clsx"
import { HTMLAttributes, ReactNode } from "react"

import style from './style.module.css'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "header" | "section"
  padding?: "sm" | "base" | "xl"
  rounded?: "base"
  children: ReactNode
}
export const Container = ({
  as: Element = "div",
  children,
  padding = "base",
  rounded,
  ...props
}: ContainerProps) => {
  const { className, ...rest } = props
  return (
    <Element
      {...rest}
      className={clsx(className, style.container)}
      data-padding={padding}
      data-rounded={rounded}
    >
      {children}
    </Element>
  )
}
