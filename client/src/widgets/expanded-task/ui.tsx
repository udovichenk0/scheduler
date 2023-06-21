import { PropsWithChildren, forwardRef } from "react"


export const ExpandedTask = forwardRef(function MyIsnput({children}:PropsWithChildren, ref:any) {
  return (
    <div ref={ref} className="flex px-2 py-2 gap-2 w-full bg-cHover rounded-[5px] text-sm">
      {children}
    </div>
  )
});