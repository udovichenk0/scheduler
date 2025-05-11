import { VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { ButtonHTMLAttributes, ForwardedRef, ReactNode, Ref } from "react"
import { RouteInstance, RouteParams, RouteQuery } from "atomic-router"
import { Link } from "atomic-router-react"

import { buttonCva } from "./cva.styles"
type BaseProps = VariantProps<typeof buttonCva> & {
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
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
  ref?: ForwardedRef<HTMLAnchorElement>
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
        className={clsx("block", className, buttonCva({ size, intent }))}
        {...props}
        to={props.to}
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
