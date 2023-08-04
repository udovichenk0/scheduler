import { useUnit } from "effector-react"
import { Fragment, useRef, useState } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskItem } from "@/entities/task/tasks"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { $$createTask, $$deleteTask, $$taskAccordion, $$updateTask, $unplacedTasks } from "./unplaced.model"
import { Layout } from "@/templates/main"

export const Unplaced = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: number }>>(null)
  const taskRef = useRef<HTMLDivElement>(null)
    const [
    tasks,
    changeStatus,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
    deleteTask,
  ] = useUnit([
    $unplacedTasks,
    $$updateTask.changeStatusTriggered,
    $$taskAccordion.$newTask,
    $$taskAccordion.$taskId,
    $$taskAccordion.closeTaskTriggered,
    $$taskAccordion.updateTaskOpened,
    $$taskAccordion.createTaskToggled,
    $$deleteTask.taskDeleted,
  ])
  return (
    <Layout>
      <Layout.Header iconName="common/cross-arrows" title="Unplaced" />
      <Layout.Content
        className="px-5"
        onClick={(e) => onClickOutside(taskRef, e, closeTaskTriggered)}>
        {
        tasks.map((task, id) => {
          return (
            <Fragment key={id}>
              {task.id === taskId ? (
                <ExpandedTask taskTitle={task.title} taskRef={taskRef}>
                  <ModifyTaskForm date={false} modifyTaskModel={$$updateTask} />
                </ExpandedTask>
              ) : (
                <TaskItem
                  isTaskSelected={selectedTask?.id === task.id}
                  onClick={selectTask}
                  onDoubleClick={() => updateTaskOpened(task)}
                  onChangeCheckbox={() => changeStatus(task.id)}
                  data={task}
                />
              )}
            </Fragment>
          )
        })}
        {newTask && (
          <ExpandedTask taskRef={taskRef}>
            <ModifyTaskForm date={false} modifyTaskModel={$$createTask} />
          </ExpandedTask>
        )}
      </Layout.Content>
      <Layout.Footer 
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened({ date: new Date() })}
        />
    </Layout>
  )
}