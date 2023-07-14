import { useUnit } from "effector-react"
import { Icon } from "@/shared/ui/icon"
import { $accent, accentChanged } from "./icon-theme.model"

const accentColors = [
  {color: 'bg-accentBlue', accent: 'blue' as const},
  {color: 'bg-accentYellow', accent: 'yellow' as const},
  {color: 'bg-accentRed', accent: 'red' as const},
  {color: 'bg-accentOrange', accent: 'orange' as const},
  {color: 'bg-accentGreen', accent: 'green' as const},
  {color: 'bg-accentPurple', accent: 'purple' as const},
  {color: 'bg-accentPink', accent: 'pink' as const},
]


export const AccentThemeChangers = () => {
  const [
    changeAccent,
    activeAccent
  ] = useUnit([
    accentChanged,
    $accent
  ])
  return (
    <>
      {accentColors.map(({color, accent}) => {
        const isActive = activeAccent == accent
        return (
          <button
          onClick={() => changeAccent(accent)}
          key={color}
          className={`inline-block w-[23px] rounded-[5px] text-center h-[23px] ${color} ${isActive && 'border-[1px] border-cFont'}`}>
            {isActive && <Icon name="common/done" className="w-[10px] -translate-y-[2px]"/>}
          </button>
        )
      })}
    </>
  )
}