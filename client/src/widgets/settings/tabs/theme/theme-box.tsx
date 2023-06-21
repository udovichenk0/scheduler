
type ThemesPropsType = {
	title: string, 
	mainBg: string, 
	topBox: string, 
	text: string, 
	leftBox: string,
	rightBox: string,
	theme: 'space' | 'default' | 'dark' | 'light' | 'grey'
}
export const ThemeBox = ({theme, action, isActive}: {theme: ThemesPropsType, action: () => void, isActive: boolean}) => {
  return (
    <button onClick={() => action()}>
      <div className={`w-[50px] flex rounded-[5px] justify-center items-end h-[50px] border-[1px] ${theme.mainBg} ${isActive ? 'border-cBorder' : 'border-none'}`}>
        <div className="w-full gap-[3px] flex items-end p-[5px]">
          <div className="w-full">
            <div className={`w-full ${theme.topBox} h-[8px] rounded-[2px]`}/>
            <div className="w-full flex gap-[2px] mt-[2px]">
              <div className={`w-full ${theme.leftBox} h-[8px] rounded-[2px]`}/>
              <div className={`w-full ${theme.rightBox} h-[8px] rounded-[2px]`}/>
            </div>
          </div>
          <span className={`text-[24px] flex text-start h-[26px] ${theme.text}`}>
						A
          </span>
        </div>
      </div>
      <p className="text-[12px] text-cFont">
        {theme.title}
      </p>
    </button>
  )
}
