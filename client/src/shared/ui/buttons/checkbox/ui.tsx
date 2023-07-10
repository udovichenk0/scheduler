import { DoneSvg } from "./done.svg";
import './style.css'
export function Checkbox({onChange, status}:{onChange: () => void, status: 'FINISHED' | 'INPROGRESS'}){
  return (
    <div className="relative flex"> 
      <input onChange={() => onChange()} checked={status == 'FINISHED' ? true : false} type="checkbox" id="checkbox" className="appearance-none w-5 h-5 border-[3px] border-cTaskEditDefault rounded-[2px]"/>
      <span id="check" className="pointer-events-none absolute left-[4px] top-[4px] hidden">
        <DoneSvg/>
      </span>
    </div>
  )
}