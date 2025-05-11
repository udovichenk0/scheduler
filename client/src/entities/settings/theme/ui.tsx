import { MainThemeChanger } from "./main-theme/main-theme.tsx"
import { AccentThemeChanger } from "./icon-theme/icon.theme.tsx"

export const ThemeChanger = () => {
  return (
    <div>
      <MainThemeChanger />
      <AccentThemeChanger />
    </div>
  )
}
