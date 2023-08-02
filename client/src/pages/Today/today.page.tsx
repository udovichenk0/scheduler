import { useUnit } from "effector-react"
import { Fragment, useRef, useState } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskItem } from "@/entities/task/tasks"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Icon } from "@/shared/ui/icon"
import {
  $$deleteTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  createTaskModel,
  taskAccordion,
  toggleOverdueTasksOpened,
  updateTaskModel,
} from "./today.model"
import { MainLayout } from "@/templates/main"

export const Today = () => {
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
    isOverdueTasksOpened,
    toggleOverdueTasks,
    overdueTasks,
    deleteTask
  ] = useUnit([
    $todayTasks,
    updateTaskModel.changeStatusTriggered,
    taskAccordion.$newTask,
    taskAccordion.$taskId,
    taskAccordion.closeTaskTriggered,
    taskAccordion.updateTaskOpened,
    taskAccordion.createTaskToggled,
    $isOverdueTasksOpened,
    toggleOverdueTasksOpened,
    $overdueTasks,
    $$deleteTask.taskDeleted
  ])

  return (
    <MainLayout
      action={() => createTaskOpened({ date: new Date() })}
      iconName="common/outlined-star"
      isTaskSelected={!!selectedTask}
      deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
      title="Today"
    >
      <div
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
        className="h-full"
      >
        <section className={`${overdueTasks.length > 0 ? "block" : "hidden"}`}>
          <div className="flex items-center gap-1 border-b-2 border-t-2 border-cBorder px-5 py-2">
            <Icon
              name="common/outlined-star"
              className="mr-1 h-5 w-5 text-cIconDefault"
            />
            <button
              onClick={toggleOverdueTasks}
              className="flex w-full items-center justify-between rounded-[5px] px-3 text-primary hover:bg-cHover"
            >
              <span className="text-lg">Overdue tasks</span>
              <span>
                <span className="mr-3 text-[12px]">
                  {!isOverdueTasksOpened && overdueTasks.length}
                </span>
                <Icon
                  name="common/arrow"
                  className={`w-[6px] ${
                    isOverdueTasksOpened ? "rotate-90" : ""
                  }`}
                />
              </span>
            </button>
          </div>
          {!!isOverdueTasksOpened && (
            <div className="border-b-2 border-cBorder px-5 py-2">
              {overdueTasks.map((task, id) => {
                return (
                  <Fragment key={id}>
                    {task.id === taskId ? (
                      <ExpandedTask taskTitle={task.title} taskRef={ref}>
                        <ModifyTaskForm modifyTaskModel={updateTaskModel} />
                      </ExpandedTask>
                    ) : (
                      <TaskItem
                        date
                        onDoubleClick={() => updateTaskOpened(task)}
                        onChange={() => changeStatus(task.id)}
                        onClick={(task) => selectTask(task)}
                        isTaskSelected={task.id == selectedTask?.id}
                        data={task}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>
          )}
        </section>
        <section>
          {!!overdueTasks.length && !!tasks.length && (
            <div
              className={`mb-2 flex items-center gap-1 border-b-2 border-cBorder px-5 py-2 text-primary `}
            >
              <Icon
                name="common/outlined-star"
                className="mr-1 h-5 w-5 text-accent"
              />
              <button className="flex w-full items-center justify-between rounded-[5px] px-3 text-lg hover:bg-cHover focus:bg-cFocus">
                Today
              </button>
            </div>
          )}
          <div className="px-5 ">
            {tasks.map((task, id) => {
              return (
                <Fragment key={id}>
                  {task.id === taskId ? (
                    <ExpandedTask taskTitle={task.title} taskRef={ref}>
                      <ModifyTaskForm modifyTaskModel={updateTaskModel} />
                    </ExpandedTask>
                  ) : (
                    <TaskItem
                        onDoubleClick={() => updateTaskOpened(task)}
                        onChange={() => changeStatus(task.id)}
                        data={task} 
                        onClick={selectTask} 
                        isTaskSelected={task.id == selectedTask?.id}
                      />
                  )}
                </Fragment>
              )
            })}
            {newTask && (
              <ExpandedTask taskRef={ref}>
                <ModifyTaskForm modifyTaskModel={createTaskModel} />
              </ExpandedTask>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
