import { VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { RouteInstance, RouteParams, RouteQuery } from "atomic-router"
import { Link } from "atomic-router-react"

import { buttonCva } from "./cva.styles"
type BaseProps = VariantProps<typeof buttonCva> & {
  children: ReactNode
}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  BaseProps & {
    as?: "button"
  }
type LinkProps = BaseProps & {
  as: "link"
  to: string | RouteInstance<RouteParams>
  params?: RouteParams | undefined
  query?: RouteQuery | undefined
  activeClassName?: string | undefined
  inactiveClassName?: string | undefined
  ref?: React.ForwardedRef<HTMLAnchorElement> | undefined
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonOrLinkProps = LinkProps | ButtonProps
export const Button = ({
  intent,
  size,
  children,
  className,
  ...props
}: ButtonOrLinkProps) => {
  if (props.as == "link") {
    return (
      <Link
        {...props}
        to={props.to}
        className={clsx(className, buttonCva({ size, intent }))}
      >
        {children}
      </Link>
    )
  }
  return (
    <button className={clsx(className, buttonCva({ size, intent }))} {...props}>
      {children}
    </button>
  )
}
