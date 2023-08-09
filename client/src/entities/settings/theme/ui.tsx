import { Typography } from "@/shared/ui/general/typography"

import { MainThemeChanger } from "./main-theme"
import { AccentThemeChanger } from "./icon-theme"

export const ThemeChanger = () => {
  return (
    <div>
      <Typography.Heading size="xs" className="mb-6 text-center text-cFont">
        Select color theme
      </Typography.Heading>
      <MainThemeChanger />
      <Typography.Heading size="xs" className="mb-6 text-center text-cFont">
        Select an accent color
      </Typography.Heading>
      <AccentThemeChanger />
    </div>
  )
}
