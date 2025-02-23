import { MainThemeChanger } from "./main-theme"
import { AccentThemeChanger } from "./icon-theme"

export const ThemeChanger = () => {
  return (
    <div>
      <MainThemeChanger/>
      <AccentThemeChanger />
    </div>
  )
}
