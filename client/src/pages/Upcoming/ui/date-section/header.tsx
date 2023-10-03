import { ReactNode, MouseEvent } from "react"

type SectionHeaderProps = {
  isNextSelectedTask?: boolean
  action: (e: MouseEvent) => void
  children: ReactNode
}
export const Header = ({
  children,
  action,
  isNextSelectedTask,
}: SectionHeaderProps) => {
  return (
    <div className="border-b border-cBorder p-2 px-3 pl-9 text-primary">
      <button
        disabled={isNextSelectedTask}
        onClick={action}
        className={`${
          isNextSelectedTask && "cursor-pointer bg-cFocus"
        } flex w-full items-center gap-2 rounded-[5px] px-3 text-lg enabled:hover:bg-cHover `}
      >
        {children}
      </button>
    </div>
  )
}
