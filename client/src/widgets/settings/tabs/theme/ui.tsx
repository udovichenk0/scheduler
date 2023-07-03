import { useUnit, useGate } from 'effector-react'
import { Fragment } from 'react'
import { ThemeBox } from './theme-box'
import { $theme, themeGate, themeChanged, accentChanged, $accent } from './theme.model'
const themeBoxes = [
  {title: 'Space', theme: 'space' as const, mainBg: 'bg-main-blue', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#1c283e]', rightBox: 'bg-[#121227]'},
  {title: 'Default', theme: 'default' as const, mainBg: 'bg-[#23242b]', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#fff]', rightBox: 'bg-[#76899b]'},
  {title: 'Dark', theme: 'dark' as const, mainBg: 'bg-[#0d0d0d]', topBox: 'bg-azure', text: 'text-[#a6a6a6]', leftBox: 'bg-[#182533]', rightBox: 'bg-[#262626]'},
  {title: 'Light', theme: 'light' as const, mainBg: 'bg-[#f9f9f9]', topBox: 'bg-azure', text: 'text-[#596175]', leftBox: 'bg-[#c7d6eb]', rightBox: 'bg-[#76899b]'},
  {title: 'Grey', theme: 'grey' as const, mainBg: 'bg-[#fff]', topBox: 'bg-azure', text: 'text-[#fffc]', leftBox: 'bg-[#595959]', rightBox: 'bg-[#dfe7f0]'},
]

const accentColors = [
  {color: 'bg-accentBlue', accent: 'blue' as const},
  {color: 'bg-accentYellow', accent: 'yellow' as const},
  {color: 'bg-accentRed', accent: 'red' as const},
  {color: 'bg-accentOrange', accent: 'orange' as const},
  {color: 'bg-accentGreen', accent: 'green' as const},
  {color: 'bg-accentPurple', accent: 'purple' as const},
  {color: 'bg-accentPink', accent: 'pink' as const},
]

export const ThemeTab = () => {
  const [changeTheme, activeTheme, activeAccent] = useUnit([themeChanged, $theme, $accent])
  useGate(themeGate)
  return (
    <div className='px-8'>
      <h2 className='text-center mb-6 text-sm text-cFont'>Select color theme</h2>
      <div className={`flex gap-2 justify-around mb-6`}>
        {themeBoxes.map((theme, id) => {
          return (
            <Fragment key={id}>
              <ThemeBox theme={theme} isActive={activeTheme == theme.theme} action={() => changeTheme(theme.theme)}/>
            </Fragment>
          )
        })}
      </div>
      <h2 className='text-center mb-6 text-sm text-cFont'>Select an accent color</h2>
      <div className='flex gap-6 justify-center'>
        {accentColors.map(({color, accent}) => {
          return (
            <button
            onClick={() => accentChanged(accent)}
            key={color}
            className={`w-[23px] rounded-[5px] h-[23px] ${color} ${activeAccent == accent && 'border-[1px] border-cFont'}`}/>
          )
        })}
      </div>
    </div>
  )
}