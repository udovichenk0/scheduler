import { useUnit } from "effector-react"
import { Fragment, useRef } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { MainLayout } from "@/widgets/layouts/main"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskItem } from "@/entities/task/tasks"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import {
  $inboxTasks,
  createTaskModel,
  taskAccordion,
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
    taskAccordion.$newTask,
    taskAccordion.$taskId,
    taskAccordion.closeTaskTriggered,
    taskAccordion.updateTaskOpened,
    taskAccordion.createTaskToggled,
  ])
  return (
    <MainLayout
      iconName={"common/inbox"}
      title={"Inbox"}
      action={() => createTaskOpened({ date: null })}
    >
      <div
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
        className="h-full px-5"
      >
        <div>
          {tasks.map((task, id) => {
            return (
              <Fragment key={id}>
                {task.id === taskId ? (
                  <ExpandedTask taskTitle={task.title} taskRef={ref}>
                    <ModifyTaskForm
                      date={false}
                      modifyTaskModel={updateTaskModel}
                    />
                  </ExpandedTask>
                ) : (
                  <TaskItem
                    onDoubleClick={() => updateTaskOpened(task)}
                    onChange={() => changeStatus(task.id)}
                    data={task}
                  />
                )}
              </Fragment>
            )
          })}
          {newTask && (
            <ExpandedTask taskRef={ref}>
              <ModifyTaskForm date={false} modifyTaskModel={createTaskModel} />
            </ExpandedTask>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
