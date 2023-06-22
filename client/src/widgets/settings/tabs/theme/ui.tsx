import { useUnit, useGate } from 'effector-react'
import { Fragment } from 'react'
import { ThemeBox } from './theme-box'
import { $theme, themeGate, themeChanged } from './theme.model'
const newthemes = [
  {title: 'Space', theme: 'space' as const, mainBg: 'bg-main-blue', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#1c283e]', rightBox: 'bg-[#121227]'},
  {title: 'Default', theme: 'default' as const, mainBg: 'bg-[#23242b]', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#fff]', rightBox: 'bg-[#76899b]'},
  {title: 'Dark', theme: 'dark' as const, mainBg: 'bg-[#0d0d0d]', topBox: 'bg-azure', text: 'text-[#a6a6a6]', leftBox: 'bg-[#182533]', rightBox: 'bg-[#262626]'},
  {title: 'Light', theme: 'light' as const, mainBg: 'bg-[#f9f9f9]', topBox: 'bg-azure', text: 'text-[#596175]', leftBox: 'bg-[#c7d6eb]', rightBox: 'bg-[#76899b]'},
  {title: 'Grey', theme: 'grey' as const, mainBg: 'bg-[#fff]', topBox: 'bg-azure', text: 'text-[#fffc]', leftBox: 'bg-[#595959]', rightBox: 'bg-[#dfe7f0]'},
]
export const ThemeTab = () => {
  const [changeTheme, activeTheme] = useUnit([themeChanged, $theme])
  useGate(themeGate)
  return (
    <div className='px-8'>
      <h2 className='text-center mb-[18px] text-cFont'>Select color theme</h2>
      <div className={`flex gap-2 justify-around`}>
        {newthemes.map((theme, id) => {
          return (
            <Fragment key={id}>
              <ThemeBox theme={theme} isActive={activeTheme == theme.theme} action={() => changeTheme(theme.theme)}/>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}