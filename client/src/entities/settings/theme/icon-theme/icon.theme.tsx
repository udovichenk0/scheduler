import { useUnit } from "effector-react"
import { useState } from "react"
import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

import { Icon } from "@/shared/ui/icon"
import { Typography } from "@/shared/ui/general/typography"

import { $$accentSettings, Accent } from "./icon-theme.model"
import style from "./style.module.css"

const { accentChanged, $accent } = $$accentSettings
export const AccentThemeChanger = () => {
  const { t } = useTranslation()
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
    <>
      <Typography.Heading
        size="xs"
        id="accent"
        className="text-cFont mb-6 text-center"
      >
        {t("setting.theme.accentTitle")}
      </Typography.Heading>
      <div className="flex justify-center gap-6">
        {themes.map((accent) => {
          return <AccentThemeBox key={accent} accent={accent} />
        })}
      </div>
    </>
  )
}
const AccentThemeBox = ({ accent }: { accent: Accent }) => {
  const changeAccent = useUnit(accentChanged)
  const activeAccent = useUnit($accent)

  const isActive = activeAccent == accent
  return (
    <button
      title={accent}
      onClick={() => changeAccent(accent)}
      key={accent}
      aria-describedby="accent"
      data-active={isActive}
      data-color={accent}
      className={clsx(style.accentColor, "focus-visible:ring")}
    >
      {isActive && (
        <Icon name="common/done" className="w-[10px] -translate-y-[1px]" />
      )}
    </button>
  )
}
