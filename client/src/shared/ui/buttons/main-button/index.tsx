import { VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { ButtonHTMLAttributes, ForwardedRef, ReactNode, Ref } from "react"
import { RouteInstance, RouteParams, RouteQuery } from "atomic-router"
import { Link } from "atomic-router-react"

import { buttonCva } from "./cva.styles"
import { Icon, IconName } from "../../icon"

type IconProps = {
  name: IconName
  className?: string
}

type BaseProps = VariantProps<typeof buttonCva> & {
  children?: ReactNode
  ref?: Ref<HTMLButtonElement>
  icon?: {
    left?: IconProps
    right?: IconProps
  }
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
  icon,
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
    <button
      className={clsx(
        "inline-flex items-center gap-x-1",
        className,
        buttonCva({ size, intent }),
      )}
      {...props}
    >
      {icon && icon.left && (
        <Icon name={icon.left.name} className={icon.left.className} />
      )}
      {children}
      {icon && icon.right && (
        <Icon name={icon.right.name} className={icon.right.className} />
      )}
    </button>
  )
}
