import { useUnit } from "effector-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Icon } from "@/shared/ui/icon"

import { $$themeSettings, Theme } from "./main-theme.model"
import style from "./styles.module.css"
const { themeChanged, $theme } = $$themeSettings

export const MainThemeChanger = () => {
  const [themes] = useState([
    "space",
    "default",
    "dark",
    "light",
    "grey",
  ] as const)
  const [activeTheme, changeTheme] = useUnit([$theme, themeChanged])
  const { t } = useTranslation()
  return (
    <div className="mb-6 flex justify-around px-10">
      {themes.map((theme) => {
        return (
          <ThemeBox
            key={theme}
            title={t(`setting.theme.${theme}`)}
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
    <button
      className="flex max-w-[50px] flex-col items-center"
      key={title}
      onClick={() => changeTheme(theme)}
    >
      <div data-color={theme} data-active={isActive} className={style.mainBg}>
        <div className="flex w-full items-end gap-[3px] p-[5px]">
          <div className="w-full">
            <div className={`h-[8px] w-full rounded-[2px] bg-accent`} />
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
      <div className="flex -translate-x-[7px] items-center justify-start gap-x-1 text-[12px] text-cFont">
        <div className="w-[10px]">
          <Icon
            name="common/done"
            className={`text-[10px] ${!isActive && "hidden"}`}
          />
        </div>
        <div>{title}</div>
      </div>
    </button>
  )
}
