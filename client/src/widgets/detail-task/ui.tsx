import { RefObject } from "react"
import { TaskForm } from "@/features/task/abstract"

export function DetailTask({focusRef}: {focusRef:RefObject<HTMLDivElement>}){
    return (
        <div ref={focusRef} className="w-full bg-[#1c283e] rounded-[5px] text-sm">
           <TaskForm/>
        </div>
    )
}