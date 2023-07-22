import { clsx } from "clsx";
import { ReactNode, RefObject } from "react"

export const ExpandedTask = ({
  taskRef, 
  className, 
  children
}: {
  taskRef: RefObject<HTMLDivElement>,
  className?: string,
  children: ReactNode
}) => {
  return (
    <div ref={taskRef} className={clsx("flex px-2 py-2 gap-2 w-full bg-cTaskEdit rounded-[5px] text-sm", className)}>
      {children}
    </div>
  )
}
