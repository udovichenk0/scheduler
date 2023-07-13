import { useUnit } from "effector-react"
import { RefObject, ReactNode, Fragment } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskDto } from "@/shared/api/task"
import { Task } from "@/shared/ui/task"
import { updateTaskModel, taskModel } from "../upcoming.model"

export function DateSection({
  outRef, 
  tasks, 
  title
}:{
  outRef: RefObject<HTMLDivElement>,
  tasks: TaskDto[], 
  title: ReactNode
}){
  const [
    changeStatus,
    taskId,
    updateTaskOpened,
  ] = useUnit([
    updateTaskModel.changeStatusTriggered,
    taskModel.$taskId,
    taskModel.updateTaskOpened,
  ])
  return (
    <div className="border-b-2 border-cBorder select-none text-primary">
      <div className="flex gap-2 text-lg items-center hover:bg-cHover mx-2 px-3 my-2 rounded-[5px] w-full">
        {title}
      </div>
      <div className=" [&>*:first-child]:border-t-2 [&>*:first-child]:border-cBorder [&>*:last-child]:pb-2 [&>*:first-child]:pt-2">
        {!!tasks.length && tasks.map((task, id) => {
          return (
            <div className="px-5" key={id}>
            {task.id === taskId ? 
              <ExpandedTask ref={outRef}>
                <ModifyTaskForm modifyTaskModel={updateTaskModel}/>
              </ExpandedTask>
              : <Task 
                date
                onDoubleClick={() => updateTaskOpened({task,ref: outRef})} 
                onChange={() => changeStatus(task.id)}
                data={task}/>}
          </div>
          )
        })}
      </div>
    </div>
  )
}