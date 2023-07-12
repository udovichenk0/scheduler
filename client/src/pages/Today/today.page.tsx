import { useUnit } from "effector-react"
import { Fragment, useRef } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { ModifyTaskForm } from "@/entities/task/modify"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Icon } from "@/shared/ui/icon"
import { Task } from "@/shared/ui/task"
import { 
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  createTaskModel,
  taskModel,
  toggleOverdueTasksOpened,
  updateTaskModel,
} from "./today.model"


export const Today = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    tasks,
    changeStatus,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
    isOverdueTasksOpened,
    toggleOverdueTasks,
    overdueTasks
  ] = useUnit([
    $todayTasks,
    updateTaskModel.changeStatusTriggered,
    taskModel.$newTask,
    taskModel.$taskId,
    taskModel.closeTaskTriggered,
    taskModel.updateTaskOpened,
    taskModel.createTaskOpened,
    $isOverdueTasksOpened,
    toggleOverdueTasksOpened,
    $overdueTasks
  ])
  return (
    <MainLayout 
      action={() => createTaskOpened({ref})} 
      iconName="common/outlined-star" title="Today">
       <div onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)} className="h-full">
        <section className={`${overdueTasks.length > 0 ? "block" : "hidden"}`}>
          <div className="border-b-2 py-2 border-t-2 border-cBorder flex items-center gap-1 px-5">
            <Icon name="common/outlined-star" className="w-5 h-5 text-cIconDefault"/>
            <button 
            onClick={toggleOverdueTasks}
            className="flex justify-between items-center hover:bg-cHover py-1 px-3 rounded-[5px] w-full">
              <h2 className="text-lg">
              Overdue tasks
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[12px]">{!isOverdueTasksOpened && overdueTasks.length}</span>
                <Icon name="common/arrow" className={`w-[6px] ${isOverdueTasksOpened ? "rotate-90" : ""}`}/>
              </div>
            </button>
          </div>
         {!!isOverdueTasksOpened && <div className="px-5 py-2 border-b-2 border-cBorder">
            {overdueTasks.map((task, id) => {
              return (
                <Fragment key={id}>
                  {task.id === taskId ? 
                    <ExpandedTask ref={ref}>
                      <ModifyTaskForm modifyTaskModel={updateTaskModel}/>
                    </ExpandedTask>
                    : <Task
                      date 
                      onDoubleClick={() => updateTaskOpened({task: task,ref})} 
                      onChange={() => changeStatus(task.id)}
                      data={task}/>}
                </Fragment>
              )
            })}
          </div>}
        </section>
        <section className="w-full">
          {!!overdueTasks.length && !!tasks.length && <div className="px-5 mb-2 border-b-2 py-2 border-cBorder flex items-center gap-1">
            <Icon name="common/outlined-star" className="w-5 h-5 text-accent"/>
            <div className="flex justify-between items-center hover:bg-cHover py-1 px-3 rounded-[5px] w-full">
              <h2 className="text-lg">
              Today
              </h2>
            </div>
          </div>}
          <div className="px-5 ">
            {tasks.map((item, id) => {
              return (
                <Fragment key={id}>
                  {item.id === taskId ? 
                    <ExpandedTask ref={ref}>
                      <ModifyTaskForm modifyTaskModel={updateTaskModel}/>
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
                <ModifyTaskForm modifyTaskModel={createTaskModel}/>
              </ExpandedTask>
            }
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

