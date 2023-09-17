import { useTranslation } from "react-i18next"

import { Typography } from "@/shared/ui/general/typography"

import { MainThemeChanger } from "./main-theme"
import { AccentThemeChanger } from "./icon-theme"

export const ThemeChanger = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Typography.Heading size="xs" className="mb-6 text-center text-cFont">
        {t("setting.theme.themeTitle")}
      </Typography.Heading>
      <MainThemeChanger />
      <Typography.Heading size="xs" className="mb-6 text-center text-cFont">
        {t("setting.theme.accentTitle")}
      </Typography.Heading>
      <AccentThemeChanger />
    </div>
  )
}
