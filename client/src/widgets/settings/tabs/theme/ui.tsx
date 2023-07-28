import { AccentThemeChanger, MainThemeChanger } from "@/entities/settings/theme"

export const ThemeTab = () => {
  return (
    <div className="px-8">
      <h2 className="mb-6 text-center text-sm text-cFont">
        Select color theme
      </h2>
      <div className={`mb-6 flex justify-around gap-2`}>
        <MainThemeChanger />
      </div>
      <h2 className="mb-6 text-center text-sm text-cFont">
        Select an accent color
      </h2>
      <div className="flex justify-center gap-6">
        <AccentThemeChanger />
      </div>
    </div>
  )
}
