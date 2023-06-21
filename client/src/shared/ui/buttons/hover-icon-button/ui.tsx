import { ReactNode } from "react"

export const HoverIconButton = ({
  icon,
  action
}:{
    icon: ReactNode,
    action: () => void
}) => {
  return (
    <button onClick={action} className="text-white px-1 py-2 outline-none transition-colors duration-150 hover:bg-cHover rounded-[5px] text-white/50">
      {icon}
    </button>
  )
}