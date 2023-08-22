import { useUnit } from "effector-react"
import { useState } from "react"

import { capitalizeLetter } from "@/shared/lib/capitalize-first-letter"
import { Icon } from "@/shared/ui/icon"

import { $$themeSettings, Theme } from "./main-theme.model"
import style from "./styles.module.css"
const { themeChanged, $theme } = $$themeSettings

export const MainThemeChanger = () => {
  const [themes] = useState([
    "space" as const,
    "default" as const,
    "dark" as const,
    "light" as const,
    "grey" as const,
  ])
  const [activeTheme, changeTheme] = useUnit([$theme, themeChanged])
  return (
    <div className="mb-6 flex justify-around px-10">
      {themes.map((theme) => {
        return (
          <ThemeBox
            key={theme}
            title={capitalizeLetter(theme)}
            theme={theme}
            activeTheme={activeTheme}
            changeTheme={changeTheme}
          />
        )
      })}
    </div>
  )
}

const ThemeBox = ({
  title,
  theme,
  activeTheme,
  changeTheme,
}: {
  title: string
  theme: Theme
  activeTheme: Theme
  changeTheme: (theme: Theme) => void
}) => {
  const isActive = activeTheme == theme
  return (
    <button key={title} onClick={() => changeTheme(theme)}>
      <div data-color={theme} data-active={isActive} className={style.mainBg}>
        <div className="flex w-full items-end gap-[3px] p-[5px]">
          <div className="w-full">
            <div
              data-color={theme}
              className={`w-full ${style.topBox} h-[8px] rounded-[2px]`}
            />
            <div className="mt-[2px] flex w-full gap-[2px]">
              <div data-color={theme} className={style.leftBox} />
              <div data-color={theme} className={style.rightBox} />
            </div>
          </div>
          <span data-color={theme} className={style.text}>
            A
          </span>
        </div>
      </div>
      <div className="flex -translate-x-[7px] justify-center gap-[3px] text-[12px] text-cFont">
        <div className="w-[10px]">
          <Icon
            name="common/done"
            className={`pr-3 text-[10px] ${!isActive && "hidden"}`}
          />
        </div>
        <span>{title}</span>
      </div>
    </button>
  )
}
