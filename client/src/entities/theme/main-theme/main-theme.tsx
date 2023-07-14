import { useUnit } from "effector-react"
import { Icon } from "@/shared/ui/icon"
import { $theme, themeChanged } from "./main-theme.model"

const themeBoxes = [
  {title: 'Space', theme: 'space' as const, mainBg: 'bg-main-blue', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#1c283e]', rightBox: 'bg-[#121227]'},
  {title: 'Default', theme: 'default' as const, mainBg: 'bg-[#23242b]', topBox: 'bg-azure', text: 'text-[#ffffff]', leftBox: 'bg-[#fff]', rightBox: 'bg-[#76899b]'},
  {title: 'Dark', theme: 'dark' as const, mainBg: 'bg-[#0d0d0d]', topBox: 'bg-azure', text: 'text-[#a6a6a6]', leftBox: 'bg-[#182533]', rightBox: 'bg-[#262626]'},
  {title: 'Light', theme: 'light' as const, mainBg: 'bg-[#f9f9f9]', topBox: 'bg-azure', text: 'text-[#596175]', leftBox: 'bg-[#c7d6eb]', rightBox: 'bg-[#76899b]'},
  {title: 'Grey', theme: 'grey' as const, mainBg: 'bg-[#fff]', topBox: 'bg-azure', text: 'text-[#fffc]', leftBox: 'bg-[#595959]', rightBox: 'bg-[#dfe7f0]'},
]

export const MainThemeChangers = () => {
  const activeTheme = useUnit($theme)
  return (
    <>
      {themeBoxes.map(({title, theme, mainBg, topBox, text, leftBox, rightBox}) => {
        const isActive = activeTheme == theme
        return (
        <button key={title} onClick={() => themeChanged(theme)}>
          <div className={`w-[50px] flex rounded-[5px] justify-center items-end h-[50px] border-[1px] ${mainBg} ${isActive ? 'border-cBorder' : 'border-none'}`}>
            <div className="w-full gap-[3px] flex items-end p-[5px]">
              <div className="w-full">
                <div className={`w-full ${topBox} h-[8px] rounded-[2px]`}/>
                <div className="w-full flex gap-[2px] mt-[2px]">
                  <div className={`w-full ${leftBox} h-[8px] rounded-[2px]`}/>
                  <div className={`w-full ${rightBox} h-[8px] rounded-[2px]`}/>
                </div>
              </div>
              <span className={`text-[24px] flex text-start h-[26px] ${text}`}>
                A
              </span>
            </div>
          </div>
          <div className="text-[12px] flex justify-center -translate-x-[7px] gap-[3px] text-cFont">
            <div className="w-[10px]">
              <Icon name="common/done" className={`w-[10px] pr-3 ${!isActive && 'hidden'}`}/>
            </div>
            <div className="">{title}</div>
          </div>
      </button>
      )})}
    </>
  )
}
