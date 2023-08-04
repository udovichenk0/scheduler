import { useUnit } from "effector-react"

import { Icon } from "@/shared/ui/icon"

import { $accent, Accent, accentChanged } from "./icon-theme.model"
import style from "./style.module.css"
const accentColors = [
  "blue" as const,
  "yellow" as const,
  "red" as const,
  "orange" as const,
  "green" as const,
  "purple" as const,
  "pink" as const,
]

export const AccentThemeChanger = () => {
  return (
    <div className="flex justify-center gap-6">
      {accentColors.map((accent) => {
        return <AccentThemeBox key={accent} accent={accent} />
      })}
    </div>
  )
}
const AccentThemeBox = ({ accent }: { accent: Accent }) => {
  const [changeAccent, activeAccent] = useUnit([accentChanged, $accent])
  const isActive = activeAccent == accent
  return (
    <button
      onClick={() => changeAccent(accent)}
      key={accent}
      data-active={isActive}
      data-color={accent}
      className={style.accentColor}
    >
      {isActive && (
        <Icon name="common/done" className="w-[10px] -translate-y-[1px]" />
      )}
    </button>
  )
}
