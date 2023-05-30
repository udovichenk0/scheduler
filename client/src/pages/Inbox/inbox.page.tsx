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



const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>, closeTask: () => void) => {
    if(ref.current && !ref.current.contains(e.target as Node)){
        closeTask()
    }
}
const Inbox = () => {
    const [
        tasks,
        activeTaskId, 
        activeNewTask,
        createTaskTriggered,
        updateTaskTriggered,
        doneTaskToggled,
        closeTask
    ] = useUnit([
        $tasks,
        updateTaskModel.$activeTaskId, 
        createTaskModel.$activeNewTask,
        createTaskModel.createTaskTriggered,
        updateTaskModel.updateTaskTriggered,
        updateTaskModel.doneTaskToggled,
        closeTaskTriggered
    ])
    const ref = useRef<HTMLDivElement>(null)
    return (
        <MainLayout icon={<DownloadSvg/>} 
        title={'Inbox'} 
        action={() => {
            closeTask()
            createTaskTriggered()
        }}>
            <div onClick={(e) => onClickOutside(e, ref, closeTask)} className="px-5">
                <div>
                    {tasks.map((item, id) => {
                        return (
                            <Fragment key={id} >
                                {item.id === activeTaskId ? 
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