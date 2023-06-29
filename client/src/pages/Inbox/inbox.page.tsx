import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { CreateTaskForm } from "@/features/task/create"
import { UpdateTaskForm } from "@/features/task/update"
import { $inboxTasks } from "@/entities/task"
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
  const newRef = useRef<HTMLDivElement>(null)
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
      <div ref={newRef} onClick={(e) => onClickOutside(e, ref, closeTaskTriggered)} className="px-5">
        <div>
          {tasks.map((item, id) => {
            return (
              <Fragment key={id}>
                {item.id === taskId ? 
                  <ExpandedTask ref={ref}>
                    <UpdateTaskForm updateTaskModel={updateTaskModel}/>
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
              <CreateTaskForm createTaskModel={createTaskModel}/>
            </ExpandedTask>
          }
        </div>
      </div>
    </MainLayout>
  )
}