import { clsx } from "clsx"
import { ReactNode, HTMLAttributes } from "react"
import style from "./style.module.css"

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: ReactNode
  className?: string
  size?: "xs" | "sm" | "base" | "lg"
}
const Heading = ({
  as: Element = "h2",
  children,
  className,
  size = "base",
  ...rest
}: HeadingProps) => {
  return (
    <Element
      data-size={size}
      className={clsx(className, style.heading)}
      {...rest}
    >
      {children}
    </Element>
  )
}
interface ParagraphProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
  size?: "xs" | "sm" | "base"
}
const Paragraph = ({
  children,
  className,
  size = "base",
  ...rest
}: ParagraphProps) => {
  return (
    <p data-size={size} className={clsx(className, style.paragraph)} {...rest}>
      {children}
    </p>
  )
}

export const Typography = {
  Heading,
  Paragraph,
}
