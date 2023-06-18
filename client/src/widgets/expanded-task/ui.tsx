import { PropsWithChildren, ReactNode, RefObject, forwardRef } from "react"

type ExpandedTaskPropsType = {
    children: ReactNode,
    focusRef: RefObject<HTMLDivElement>
}

// export const ExpandedTask = ({
//   children,
//   focusRef
// }:ExpandedTaskPropsType) => {
//   return (
// <div ref={focusRef} className="flex px-2 py-2 gap-2 w-full bg-[#1c283e] rounded-[5px] text-sm">
//   {children}
// </div>
//   )
// }

export const ExpandedTask = forwardRef(function MyIsnput({children}:PropsWithChildren, ref:any) {
  return (
    <div ref={ref} className="flex px-2 py-2 gap-2 w-full bg-[#1c283e] rounded-[5px] text-sm">
      {children}
    </div>
  )
});