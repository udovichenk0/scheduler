import { AccentThemeChanger } from "@/shared/theme/icon-theme"
import { MainThemeChanger } from "@/shared/theme/main-theme"

export const ThemeTab = () => {
  return (
    <div className='px-8'>
      <h2 className='text-center mb-6 text-sm text-cFont'>Select color theme</h2>
      <div className={`flex gap-2 justify-around mb-6`}>
        <MainThemeChanger/>
      </div>
      <h2 className='text-center mb-6 text-sm text-cFont'>Select an accent color</h2>
      <div className='flex gap-6 justify-center'>
        <AccentThemeChanger/>
      </div>
    </div>
  )
}