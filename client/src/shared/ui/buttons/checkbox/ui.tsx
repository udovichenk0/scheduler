import { DoneSvg } from "./done.svg";

export function Checkbox({onChange, done}:{onChange: () => void, done: boolean}){
    return (
    <div className="relative flex">
        <input onChange={() => onChange()} checked={done} type="checkbox" id="checkbox" className="appearance-none w-5 h-5 border-[3px] border-grey rounded-[2px]"/>
        <span id="check" className="pointer-events-none absolute left-[3px] top-[2px] hidden"><DoneSvg/></span>
    </div>
    )
}