import { Checkbox } from "../buttons/checkbox";

export function Task({
  title, 
  status, 
  onChange, 
  onDoubleClick
}: {
    title: string, 
    status: 'FINISHED' | 'INPROGRESS' | 'CANCELED', 
    onChange: () => void, 
    onDoubleClick: () => void
}){
  return (
    <div onDoubleClick={onDoubleClick} className="select-none text-primary flex items-center w-full hover:bg-cHover  rounded-[5px] px-2 py-2">
      <Checkbox onChange={onChange} status={status}/>
      <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium dark:text-gray-300">{title}</label>
    </div>
  )
}