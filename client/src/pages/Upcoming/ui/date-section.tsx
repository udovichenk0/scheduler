import { useUnit } from "effector-react"
import { RefObject, ReactNode } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { Task, TaskItem } from "@/entities/task/tasks"
import { updateTaskModel, taskAccordion, createTaskModel } from "../upcoming.model"

export function DateSection({
  outRef, 
  tasks, 
  title,
  isSelected,
  action
}:{
  outRef: RefObject<HTMLDivElement>,
  tasks: Task[], 
  title: ReactNode,
  isSelected: boolean,
  action: () => void
}){
  const [
    changeStatus,
    taskId,
    updateTaskOpened,
    newTask
  ] = useUnit([
    updateTaskModel.changeStatusTriggered,
    taskAccordion.$taskId,
    taskAccordion.updateTaskOpened,
    taskAccordion.$newTask
  ])
  return (
    <div className="border-b-2 border-cBorder select-none text-primary">
      <div className={'px-2'}>
        <button disabled={isSelected} onClick={action} 
        className={`${isSelected && 'bg-cFocus cursor-pointer'} flex gap-2 text-lg items-center enabled:hover:bg-cHover px-3 my-2 rounded-[5px] w-full`}>
          {title}
        </button>
      </div>
      <div>
        {!!tasks?.length && tasks.map((task, id) => {
          return (
            <div className="px-4 first:border-t-2 first:border-cBorder first:pt-2 last:pb-2" key={id}>
            {task.id === taskId ? 
              <ExpandedTask taskRef={outRef}>
                <ModifyTaskForm modifyTaskModel={updateTaskModel}/>
              </ExpandedTask>
              : <TaskItem 
                date
                onDoubleClick={() => updateTaskOpened(task)} 
                onChange={() => changeStatus(task.id)}
                data={task}/>}
          </div>
          )
        })}
      </div>
      <div className="px-4">
        {newTask && isSelected && 
          <ExpandedTask className="mb-2" taskRef={outRef}>
            <ModifyTaskForm date modifyTaskModel={createTaskModel}/> 
          </ExpandedTask>
        }
      </div>
    </div>
  )
}