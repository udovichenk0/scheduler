import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { DetailTask } from "@/widgets/detail-task"
import { MainLayout } from "@/widgets/layouts/main"
import { Task } from "@/shared/ui/task"
import { DownloadSvg } from "./assets/inbox.svg"
import './inbox.css'
import { 
    $tasks,
    closeTaskTriggered,
    createTaskModel,
    updateTaskModel,
} from "./inbox.model"



const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>) => {
    if(ref.current && !ref.current.contains(e.target as Node)){
        closeTaskTriggered()
    }
}
const Inbox = () => {
    const {$activeNewTask, createTaskTriggered} = createTaskModel
    const {$activeTaskId, updateTaskTriggered, doneTaskToggled} = updateTaskModel
    const [activeTask, activeNewTask] = useUnit([$activeTaskId, $activeNewTask])
    const data = useUnit($tasks) 
    const ref = useRef<HTMLDivElement>(null)
    return (
        <MainLayout icon={<DownloadSvg/>} 
        title={'Inbox'} 
        action={() => {
            closeTaskTriggered()
            createTaskTriggered()
        }}>
            <div onClick={(e) => onClickOutside(e, ref)} className="px-5">
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