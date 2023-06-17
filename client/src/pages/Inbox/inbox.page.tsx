import { useUnit } from "effector-react"
import { Fragment, useRef, MouseEvent, RefObject } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { CreateTaskForm } from "@/features/task/create"
import { UpdateTaskForm } from "@/features/task/update"
import { Icon } from "@/shared/ui/icon"
import { Task } from "@/shared/ui/task"
import { 
  $tasks,
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
    doneTaskToggled,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
        
  ] = useUnit([
    $tasks,
    updateTaskModel.doneTaskToggled,
    taskModel.$newTask,
    taskModel.$taskId,
    taskModel.closeTaskTriggered,
    taskModel.updateTaskOpened,
    taskModel.createTaskOpened,
  ])
  return (
    <MainLayout icon={<Icon name="common/inbox" className="fill-grey w-5 h-5"/>} 
      title={'Inbox'}
      action={() => {
        createTaskOpened()
      }}>
      <div onClick={(e) => onClickOutside(e, ref, closeTaskTriggered)} className="px-5">
        <div>
          {tasks.map((item, id) => {
            return (
              <Fragment key={id}>
                {item.id === taskId ? 
                  <ExpandedTask focusRef={ref}>
                    <UpdateTaskForm updateTaskModel={updateTaskModel}/>
                  </ExpandedTask>
                  : <Task onDoubleClick={() => updateTaskOpened(item.id)} title={item.title} status={item.status} 
                    onChange={() => doneTaskToggled(item.id)}/>}
              </Fragment>
            )
          })}
          {newTask && 
                    <ExpandedTask focusRef={ref}>
                      <CreateTaskForm createTaskModel={createTaskModel}/>
                    </ExpandedTask>
          }
        </div>
      </div>
    </MainLayout>
  )
}