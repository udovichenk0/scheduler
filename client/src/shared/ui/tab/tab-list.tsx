import { ReactNode } from "react"
type TabListType = {
  children: ReactNode
  className?: string
}
export function List({ children, className, ...props }: TabListType) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
