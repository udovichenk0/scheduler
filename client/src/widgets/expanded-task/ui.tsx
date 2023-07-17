import { clsx } from "clsx";
import { ReactNode, forwardRef } from "react"
type ExpandedTaskType = {
  children: ReactNode,
  className?: string
}
//! Work it out
export const ExpandedTask = forwardRef<HTMLDivElement, ExpandedTaskType>(
  function MyInput({children, className}, ref) {
  return (
    <div ref={ref} className={clsx("flex px-2 py-2 gap-2 w-full bg-cTaskEdit rounded-[5px] text-sm", className)}>
      {children}
    </div>
  )
});