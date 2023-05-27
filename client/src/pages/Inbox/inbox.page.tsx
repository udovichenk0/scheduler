import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { DetailTask } from "@/widgets/detail-task"
import { Task } from "@/shared/ui/task"
import { AddSvg } from "./assets/add.svg"
import { DownloadSvg } from "./assets/inbox.svg"
import './inbox.css'
import { 
    $tasks,
    createTaskModel,
    getTasksFx,
    updateTaskModel,
} from "./inbox.model"

getTasksFx()

const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>, activeTask: number | null) => {
    if(ref.current && !ref.current.contains(e.target as Node)){
        if(activeTask){
            updateTaskModel.closeExpandedTask()
        }
        else {
            createTaskModel.closeTaskTriggered()
        }
    }
}
const Inbox = () => {
    const {$activeNewTask, createTaskTriggered} = createTaskModel
    const {$activeTaskId, expandTaskTriggered, doneTaskToggled} = updateTaskModel
    const [activeTask, activeNewTask] = useUnit([$activeTaskId, $activeNewTask])
    const data = useUnit($tasks) 
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div onClick={(e) => onClickOutside(e, ref, activeTask)} className="px-5">
            <div className="flex gap-4 items-center">
                <DownloadSvg/>
                <h1 className="text-2xl">Inbox</h1>
            </div>
            <div>
            {data.map((item, id) => {
                return (
                    <Fragment key={id} >
                        {item.id === activeTask ? 
                        <DetailTask focusRef={ref}/>
                        : <Task onDoubleClick={() => expandTaskTriggered(item.id)} title={item.title} done={item.done} 
                        onChange={() => doneTaskToggled({id:item.id, done: !item.done})}/>}
                    </Fragment>
                )
            })}
            {activeNewTask && <DetailTask focusRef={ref}/>}
            </div>
                <CreateTask action={() => createTaskTriggered()}/>  
        </div>  
    )
}

function CreateTask({action}:{action: () => void}){
    return (
        <button onClick={() => action()} className="text-azure py-2 px-3 rounded-[5px] hover:bg-[#0e162e] text-sm flex items-center gap-2">
            <AddSvg/> <span>New Task</span>
        </button>
    )
}


export default Inbox