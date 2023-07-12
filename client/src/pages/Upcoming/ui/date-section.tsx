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
    <div className="px-5 border-b-2 py-3 border-cBorder select-none">
      <div className="flex gap-2 text-lg items-center hover:bg-cHover px-3 rounded-[5px] w-full">
        {title}
      </div>
      {!!tasks.length && tasks.map((task, id) => {
        return (
          <Fragment key={id}>
          {task.id === taskId ? 
            <ExpandedTask ref={outRef}>
              <ModifyTaskForm modifyTaskModel={updateTaskModel}/>
            </ExpandedTask>
            : <Task 
              date
              onDoubleClick={() => updateTaskOpened({task,ref: outRef})} 
              onChange={() => changeStatus(task.id)}
              data={task}/>}
        </Fragment>
        )
      })}
    </div>
  )
}