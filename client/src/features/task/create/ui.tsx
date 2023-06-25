import { useUnit } from "effector-react"
import { capitalizeLetter } from "@/shared/lib/capitalize-letter"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { CreateTaskType } from "./task.model"

export const CreateTaskForm = ({
  createTaskModel,
}:{
    createTaskModel: CreateTaskType,
}) => {
  const [
    title, 
    note, 
    status,
    type,
    changeStatus,
    changeDescription,
    changeTitle
  ] = useUnit([
    createTaskModel.$title, 
    createTaskModel.$description, 
    createTaskModel.$status, 
    createTaskModel.$type,
    createTaskModel.statusChanged, 
    createTaskModel.descriptionChanged, 
    createTaskModel.titleChanged
  ])
  return (
    <div className="flex gap-2 w-full rounded-[5px] text-sm">
      <Checkbox status={status} onChange={changeStatus}/>
      <div className="flex flex-col w-full gap-3">
        <input 
          onChange={(e) => changeTitle(e.target.value)} 
          value={title} placeholder={title ? '' : 'New Task'} 
          className="w-full bg-transparent outline-none text-sm font-medium text-cFont dark:text-gray-300"/>
        <input className="w-full bg-transparent text-grey outline-none text-sm" 
          placeholder={note ? '' : 'Note'} 
          value={note || ''} 
          onChange={(e) => changeDescription(e.target.value)}/>
        <span>
          <Button icon={<Icon name={'common/inbox'} className="text-accent w-[18px] h-[18px]"/>} title={capitalizeLetter(type)} size={'sm'} intent={'primary'}/>
        </span>
      </div>
    </div>
  )
}