import { useUnit } from "effector-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { clsx } from "clsx"

import { Icon } from "@/shared/ui/icon"
import { Typography } from "@/shared/ui/general/typography"

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
    <>
      <Typography.Heading
        size="xs"
        id="theme"
        className="text-cFont mb-6 text-center"
      >
        {t("setting.theme.themeTitle")}
      </Typography.Heading>
      <div className="mb-12 flex items-center justify-around px-10">
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
    </>
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
  const ref = useRef<HTMLButtonElement>(null)
  const isActive = activeTheme == theme
  useEffect(() => {
    if (isActive) {
      ref.current?.focus()
    }
  }, [])
  return (
    <button
      ref={ref}
      aria-describedby="theme"
      className="group flex w-[60px] flex-col items-center"
      key={title}
      onClick={() => changeTheme(theme)}
    >
      <div
        data-color={theme}
        data-active={isActive}
        className={clsx(style.mainBg, "group-focus-visible:ring")}
      >
        <div className="flex w-10 items-center justify-center gap-[3px]">
          <div className="w-full">
            <div
              data-color={theme}
              className={`h-[8px] w-full rounded-[2px] ${style.topBox}`}
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
        <div className="text-cFont group absolute -bottom-5 flex justify-end gap-x-1 text-[12px]">
          <div className="absolute -left-[12px] w-[10px]">
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
