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
  const { t } = useTranslation()

  const activeTheme = useUnit($theme)
  const changeTheme = useUnit(themeChanged)
  return (
    <div className="mb-6 flex justify-around items-center h-[100px] px-10">
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
      className="flex flex-col items-center w-[60px]"
      key={title}
      onClick={() => changeTheme(theme)}
    >
        <div data-color={theme} data-active={isActive} className={style.mainBg}>
          <div className="flex w-10 items-center justify-center gap-[3px]">
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
          <div className="flex group justify-end gap-x-1 text-[12px] text-cFont absolute -bottom-5">
            <div className="w-[10px] absolute -left-[12px]">
              <Icon
                name="common/done"
                className={`text-[10px] ${!isActive && "hidden"}`}
              />
            </div>
            <div>{title}</div>
          </div>
        </div>
    </button>
  )
}
