import { useUnit } from "effector-react"
import { useState } from "react"

import { Icon } from "@/shared/ui/icon"

import { $$accentSettings, Accent } from "./icon-theme.model"
import style from "./style.module.css"

const { accentChanged, $accent } = $$accentSettings
export const AccentThemeChanger = () => {
  const [themes] = useState([
    "blue",
    "yellow",
    "red",
    "orange",
    "green",
    "purple",
    "pink",
  ] as const)
  return (
    <div className="flex justify-center gap-6">
      {themes.map((accent) => {
        return <AccentThemeBox key={accent} accent={accent} />
      })}
    </div>
  )
}
const AccentThemeBox = ({ accent }: { accent: Accent }) => {
  const changeAccent = useUnit(accentChanged)
  const activeAccent = useUnit($accent)

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
