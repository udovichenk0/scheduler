import { useUnit } from "effector-react"
import { RefObject } from "react"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { CreateTaskType } from "./task.model"

export const CreateTaskForm = ({
    createTaskModel,
    focusRef
}:{
    createTaskModel: CreateTaskType,
    focusRef: RefObject<HTMLDivElement>
}) => {
    const [
        title, 
        note, 
        done,
        toggleCheckbox,
        changeNote,
        changeTitle
    ] = useUnit([
        createTaskModel.$title, 
        createTaskModel.$note, 
        createTaskModel.$done, 
        createTaskModel.checkboxToggled, 
        createTaskModel.noteChanged, 
        createTaskModel.titleChanged
        ])
    return (
        <div ref={focusRef} className="flex px-2 py-2 gap-2 w-full bg-[#1c283e] rounded-[5px] text-sm">
        <Checkbox done={done} onChange={toggleCheckbox}/>
        <div className="flex flex-col w-full gap-3">
            <input 
            onChange={(e) => changeTitle(e.target.value)} 
            value={title} placeholder={title ? '' : 'New Task'} 
            className="w-full bg-transparent outline-none text-sm font-medium text-white dark:text-gray-300"/>
            <input className="w-full bg-transparent text-grey outline-none" 
            placeholder={note ? '' : 'Note'} 
            value={note} 
            onChange={(e) => changeNote(e.target.value)}/>
        </div>
    </div>
    )
}