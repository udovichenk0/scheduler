import { useUnit } from "effector-react"
import { Fragment, useRef, useState } from "react"
import { ExpandedTask } from "@/widgets/expanded-task"
import { ModifyTaskForm } from "@/entities/task/modify"
import { TaskItem } from "@/entities/task/tasks"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import {
  $$deleteTask,
  $inboxTasks,
  $$createTask,
  $$taskAccordion,
  $$updateTask,
} from "./inbox.model"
import { Layout } from "@/templates/main"

export const Inbox = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: number }>>(null)
  const ref = useRef<HTMLDivElement>(null)
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
    $inboxTasks,
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
      <Layout.Header iconName="common/inbox" title="Inbox" />
      <Layout.Content
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
        className="h-full px-5"
      >
        {tasks.map((task, id) => {
          return (
            <Fragment key={id}>
              {task.id === taskId ? (
                <ExpandedTask taskTitle={task.title} taskRef={ref}>
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
          <ExpandedTask taskRef={ref}>
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
