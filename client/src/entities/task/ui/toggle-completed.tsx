import { Toggle } from "@/shared/ui/data-entry/switch-toggle"

export const CompletedToggle = ({ onToggle, checked }: { onToggle: () => void, checked: boolean }) => {
  return (
    <div className="flex items-center gap-x-1">
      <span className="text-xs">Completed</span> <Toggle checked={checked} aria-label="Completed tasks" onChange={onToggle}/>
    </div>
  )
}