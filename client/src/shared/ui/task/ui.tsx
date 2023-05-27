import { Checkbox } from "../buttons/checkbox";

export function Task({title, done, onChange, onDoubleClick}: {title: string, done: boolean, onChange: () => void, onDoubleClick: () => void}){
    return (
        <div onDoubleClick={onDoubleClick} className="select-none flex items-center w-full hover:bg-[#0e162e]  rounded-[5px] px-2 py-2">
            <Checkbox onChange={onChange} done={done}/>
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{title}</label>
        </div>
    )
}