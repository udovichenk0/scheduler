export const StartButton = ({
  start,
  stop,
  isTicking,
  isWorkTime
}: {
  start: () => void,
  stop: () => void,
  isTicking: boolean,
  isWorkTime: boolean
}) => {
  return (
    <button 
      className={`h-8 w-8 rounded-full outline-none flex justify-center ${isWorkTime ? 'border-cPomodoroRed' : 'border-cPomodoroGreen'} border-2  items-center`} 
      onClick={isTicking ? stop : start}>
        {isTicking 
        ? <span className={`w-0 h-0 rotate-90 ${isWorkTime ? 'border-cPomodoroRed' : 'border-cPomodoroGreen'} border-cPomodoroRed translate-x-[1px] border-style border-t-[0px] border-x-[6px] border-b-[12px]`}/>
        : <span className={`w-0 h-0 rotate-90 ${isWorkTime ? 'border-cPomodoroRed' : 'border-cPomodoroGreen'} border-x-transparent translate-x-[1px] border-style border-t-[0px] border-x-[6px] border-b-[12px] `}/>
        }
        

    </button>
  )
}
