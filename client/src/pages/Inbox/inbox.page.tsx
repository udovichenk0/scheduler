import { useUnit } from "effector-react"
import { Fragment, useRef, useState } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskItem } from "@/entities/task/tasks"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import {
  $$deleteTask,
  $inboxTasks,
  createTaskModel,
  taskAccordion,
  updateTaskModel,
} from "./inbox.model"
import { MainLayout } from "@/templates/main"

export const Inbox = () => {
  const [selectedTask, selectTask] = useState<{id: number} | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [
    tasks,
    changeStatus,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
    deleteTask
  ] = useUnit([
    $inboxTasks,
    updateTaskModel.changeStatusTriggered,
    taskAccordion.$newTask,
    taskAccordion.$taskId,
    taskAccordion.closeTaskTriggered,
    taskAccordion.updateTaskOpened,
    taskAccordion.createTaskToggled,
    $$deleteTask.taskDeleted,
  ])
  return (
    <MainLayout
      isTaskSelected={!!selectedTask}
      iconName={"common/inbox"}
      title={"Inbox"}
      deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
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
                    isTaskSelected={selectedTask?.id === task.id}
                    onClick={selectTask}
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