import { useUnit } from "effector-react"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
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
    changeStatus,
    changeDescription,
    changeTitle
  ] = useUnit([
    createTaskModel.$title, 
    createTaskModel.$description, 
    createTaskModel.$status, 
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
          className="w-full bg-transparent outline-none text-sm font-medium text-white dark:text-gray-300"/>
        <input className="w-full bg-transparent text-grey outline-none" 
          placeholder={note ? '' : 'Note'} 
          value={note || ''} 
          onChange={(e) => changeDescription(e.target.value)}/>
      </div>
    </div>
  )
}