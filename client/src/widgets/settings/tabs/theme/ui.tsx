import { AccentThemeChanger, MainThemeChanger } from "@/entities/settings/theme"

import { Typography } from "@/shared/ui/general/typography"

export const ThemeTab = () => {
  return (
    <div className="px-8">
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
