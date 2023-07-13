import { PropsWithChildren, forwardRef } from "react"

//! Work it out
export const ExpandedTask = forwardRef<HTMLDivElement, PropsWithChildren>(function MyInput({children}, ref) {
  return (
    <div ref={ref} className="flex px-2 py-2 gap-2 w-full bg-cTaskEdit rounded-[5px] text-sm">
      {children}
    </div>
  )
});