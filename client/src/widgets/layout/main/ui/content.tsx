import { clsx } from "clsx"
import { HTMLAttributes, RefObject } from "react"
interface ContentProps extends HTMLAttributes<HTMLElement> {
  contentRef?: RefObject<HTMLDivElement>
}
export const Content = (props: ContentProps) => {
  const { children, className, contentRef, ...rest } = props
  return (
    <section
      data-testid="page-content"
      {...rest}
      ref={contentRef}
      className={clsx(
        "w-full scroll-pr-2.5 overflow-hidden overflow-y-scroll",
        className,
      )}
    >
      {children}
    </section>
  )
}
