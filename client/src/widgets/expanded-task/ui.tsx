import { PropsWithChildren, forwardRef } from "react"


export const ExpandedTask = forwardRef<HTMLDivElement, PropsWithChildren>(function MyIsnput({children}, ref) {
  return (
    <div ref={ref} className="flex px-2 py-2 gap-2 w-full bg-cHover rounded-[5px] text-sm">
      {children}
    </div>
  )
});