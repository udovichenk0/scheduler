import { useUnit } from "effector-react"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { UpdateTaskType } from "./task.model"

export const UpdateTaskForm = ({
  updateTaskModel,
}:{
    updateTaskModel: UpdateTaskType,
}) => {
  const [
    title, 
    description, 
    status,
    type,
    changeStatus,
    changeDescription,
    changeTitle
  ] = useUnit([
    updateTaskModel.$title, 
    updateTaskModel.$description, 
    updateTaskModel.$status, 
    updateTaskModel.$type,
    updateTaskModel.statusChanged, 
    updateTaskModel.descriptionChanged, 
    updateTaskModel.titleChanged
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
          placeholder={description ? '' : 'Note'} 
          value={description || ''} 
          onChange={(e) => changeDescription(e.target.value)}/>
        <span>
          <Button icon={<Icon name={'common/inbox'} className="text-accent w-[18px] h-[18px]"/>} title={capitalizeLetter(type)} size={'sm'} intent={'primary'}/>
        </span>
      </div>
      <div>
      </div>
    </div>
  )
}

function capitalizeLetter(word: string){
  return word.slice(0,1).toUpperCase() + word.slice(1, word.length)
}