import { useUnit } from "effector-react"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { $done, $note, $title, checkToggle, noteChanged, titleChanged } from "./abstract.model"

export const TaskForm = () => {
    const [title, note, done] = useUnit([$title, $note, $done])
    return (
        <div className="flex px-2 py-2 gap-2">
            <Checkbox done={done} onChange={checkToggle}/>
            <div className="flex flex-col w-full gap-3">
                <input 
                onChange={(e) => titleChanged(e.target.value)} 
                value={title} placeholder={title ? '' : 'New Task'} 
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-gray-300"/>
                <input className="w-full bg-transparent text-grey outline-none" placeholder={note ? '' : 'Note'} value={note} onChange={(e) => noteChanged(e.target.value)}/>
            </div>
        </div>
    )
}