import { useUnit } from "effector-react"
import { Fragment, useRef } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { ModifyTaskForm } from "@/entities/task/modify"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Task } from "@/shared/ui/task"
import { 
  $inboxTasks,
  createTaskModel,
  taskModel,
  updateTaskModel,
} from "./inbox.model"

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
    taskModel.createTaskToggled,
  ])
  return (
    <MainLayout iconName={'common/inbox'}
      title={'Inbox'}
      action={() => createTaskOpened({date: null})}>
      <div onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)} className="px-5 h-full">
        <div>
          {tasks.map((task, id) => {
            return (
              <Fragment key={id}>
                {task.id === taskId ? 
                  <ExpandedTask taskRef={ref}>
                    <ModifyTaskForm date={false} modifyTaskModel={updateTaskModel}/>
                  </ExpandedTask>
                  : <Task 
                    onDoubleClick={() => updateTaskOpened({task: task,ref})} 
                    onChange={() => changeStatus(task.id)}
                    data={task}/>}
              </Fragment>
            )
          })}
          {newTask && 
            <ExpandedTask taskRef={ref}>
              <ModifyTaskForm date={false} modifyTaskModel={createTaskModel}/> 
            </ExpandedTask>
          }
        </div>
      </div>
    </MainLayout>
  )
}