import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { DetailTask } from "@/widgets/detail-task"
import { MainLayout } from "@/widgets/layouts/main"
import { Task } from "@/shared/ui/task"
import { DownloadSvg } from "./assets/inbox.svg"
import './inbox.css'
import { 
    $tasks,
    createTaskModel,
    updateTaskModel,
} from "./inbox.model"


const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>, activeTask: number | null) => {
    if(ref.current && !ref.current.contains(e.target as Node)){
        if(activeTask){
            updateTaskModel.taskUpdated()
        }
        else {
            createTaskModel.taskCreated()
        }
    }
}
const Inbox = () => {
    const {$activeNewTask, createTaskTriggered} = createTaskModel
    const {$activeTaskId, updateTaskTriggered, doneTaskToggled} = updateTaskModel
    const [activeTask, activeNewTask] = useUnit([$activeTaskId, $activeNewTask])
    const data = useUnit($tasks) 
    const ref = useRef<HTMLDivElement>(null)
    return (
        <MainLayout icon={<DownloadSvg/>} title={'Inbox'} action={createTaskTriggered}>
            <div onClick={(e) => onClickOutside(e, ref, activeTask)} className="px-5">
                <div>
                {data.map((item, id) => {
                    return (
                        <Fragment key={id} >
                            {item.id === activeTask ? 
                            <DetailTask focusRef={ref}/>
                            : <Task onDoubleClick={() => updateTaskTriggered(item.id)} title={item.title} done={item.done} 
                            onChange={() => doneTaskToggled(item.id)}/>}
                        </Fragment>
                    )
                })}
                {activeNewTask && <DetailTask focusRef={ref}/>}
                </div>
            </div>
        </MainLayout>
    )
}

export default Inbox