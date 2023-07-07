import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { ModifyTaskForm } from "@/entities/task/modify"
import { $inboxTasks } from "@/entities/task/tasks"
import { Task } from "@/shared/ui/task"
import { 
  createTaskModel,
  taskModel,
  updateTaskModel,
} from "./inbox.model"



const onClickOutside = (e:MouseEvent, ref:RefObject<HTMLDivElement>, closeTask: () => void) => {
  if(ref.current && !ref.current.contains(e.target as Node)){
    closeTask()
  }
}
export const Inbox = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    tasks,
    changeStatus,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
        
  ] = useUnit([
    $inboxTasks,
    updateTaskModel.changeStatusTriggered,
    taskModel.$newTask,
    taskModel.$taskId,
    taskModel.closeTaskTriggered,
    taskModel.updateTaskOpened,
    taskModel.createTaskOpened,
  ])
  return (
    <MainLayout iconName={'common/inbox'}
      title={'Inbox'}
      action={() => createTaskOpened({ref})}>
      <div onClick={(e) => onClickOutside(e, ref, closeTaskTriggered)} className="px-5">
        <div>
          {tasks.map((item, id) => {
            return (
              <Fragment key={id}>
                {item.id === taskId ? 
                  <ExpandedTask ref={ref}>
                    <ModifyTaskForm date={true} modifyTaskModel={updateTaskModel}/>
                  </ExpandedTask>
                  : <Task 
                    onDoubleClick={() => updateTaskOpened({task: item,ref})} 
                    onChange={() => changeStatus(item.id)}
                    data={item}/>}
              </Fragment>
            )
          })}
          {newTask && 
            <ExpandedTask ref={ref}>
              <ModifyTaskForm date={false} modifyTaskModel={createTaskModel}/> 
            </ExpandedTask>
          }
        </div>
      </div>
    </MainLayout>
  )
}

//TODO MOVE FORM TO WIDGET