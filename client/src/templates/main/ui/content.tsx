import { clsx } from "clsx"
import { HTMLAttributes } from "react"

export const Content = (props: HTMLAttributes<HTMLElement>) => {
  const { children, className, ...rest } = props
  return (
    <section
      {...rest}
      className={clsx(
        "h-full w-full scroll-pr-2.5 overflow-hidden overflow-y-scroll",
        className,
      )}
    >
      {children}
    </section>
  )
}
