import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { AddSvg } from "./assets/add.svg"
import { DoneSvg } from "./assets/done.svg"
import { DownloadSvg } from "./assets/inbox.svg"
import './inbox.css'
import { 
    $tasks,
    doneTasktoggled, 
    expandedTask,
    getTasksFx,
} from "./inbox.model"

getTasksFx()

const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>) => {
    if(ref.current && !ref.current.contains(e.target as Node)){
        expandedTask.closeExpandedTask()
    }
}
const Inbox = () => {
    const {$activeTaskId, setActiveTriggered, createTask, $activeNewTask} = expandedTask
    const [activeTask, activeNewTask] = useUnit([$activeTaskId, $activeNewTask])
    const data = useUnit($tasks) 
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div onClick={(e) => onClickOutside(e, ref)} className="px-5">
            <div className="flex gap-4 items-center">
                <DownloadSvg/>
                <h1 className="text-2xl">Inbox</h1>
            </div>
            <div>
            {data.map((item, id) => {
                return (
                    <Fragment key={id} >
                        {item.id === activeTask ? 
                        <Window focusRef={ref}/>
                        : <CheckBox onDoubleClick={() => setActiveTriggered(item.id)} title={item.title} done={item.done} 
                        onChange={() => doneTasktoggled({id:item.id, done: !item.done})}/>}
                    </Fragment>
                )
            })}
            {activeNewTask && <Window focusRef={ref}/>}
            </div>
                <CreateTask action={() => createTask()}/>  
        </div>  
    )
}

function CreateTask({action}:{action: () => void}){
    return (
        <button onClick={() => action()} className="text-azure text-sm flex items-center gap-2">
            <AddSvg/> <span>New Task</span>
        </button>
    )
}

function Window({focusRef}: {focusRef:RefObject<HTMLDivElement>}){
    const {$title, $note, $done, titleChanged, noteChanged, checkToggle} = expandedTask
    const [title, note, done] = useUnit([$title, $note, $done])
    return (
        <div ref={focusRef} className="w-full bg-[#1c283e] rounded-[5px] text-sm">
           <div className="flex px-2 py-2 gap-2">
                <div className="relative flex">
                    <input onChange={() => checkToggle(!done)} checked={done} type="checkbox" id="checkbox" className="appearance-none w-5 h-5 border-[3px] border-grey rounded-[2px]"/>
                    <span id="check" className="pointer-events-none absolute left-[3px] top-[2px] hidden"><DoneSvg/></span>
                </div>
                <div className="flex flex-col w-full">
                    <input 
                    onChange={(e) => titleChanged(e.target.value)} 
                    value={title} placeholder={title ? '' : 'New Task'} 
                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-gray-300"/>
                    <input className="w-full bg-transparent text-grey outline-none" placeholder={note ? '' : 'Note'} value={note} onChange={(e) => noteChanged(e.target.value)}/>
                </div>
            </div>
        </div>
    )
}

function CheckBox({title, done, onChange, onDoubleClick}: {title: string, done: boolean, onChange: () => void, onDoubleClick: () => void}){
    return (
        <div onDoubleClick={onDoubleClick} className="select-none flex items-center w-full hover:bg-[#0e162e]  rounded-[5px] px-2 py-2">
            <MainCheckbox onChange={onChange} done={done}/>
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{title}</label>
        </div>
    )
}

function MainCheckbox({onChange, done}:{onChange: () => void, done: boolean}){
    return (
    <div className="relative flex items-center">
        <input onChange={() => onChange()} checked={done} type="checkbox" id="checkbox" className="appearance-none w-5 h-5 border-[3px] border-grey rounded-[2px]"/>
        <span id="check" className="pointer-events-none absolute left-[3px] top-[2px] hidden"><DoneSvg/></span>
    </div>
    )
}

export default Inbox