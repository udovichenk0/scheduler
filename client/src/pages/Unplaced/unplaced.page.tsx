import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem } from "@/entities/task/task-item"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { NoTasks } from "@/shared/ui/no-tasks"

import {
  $$createTask,
  $$deleteTask,
  $$taskDisclosure,
  $$updateTask,
  $unplacedTasks,
} from "./unplaced.model"

export const Unplaced = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
  const taskRef = useRef<HTMLDivElement>(null)
  const [
    unplacedTasks,
    createdTask,
    updatedTaskId,
    closeTask,
    openUpdatedTaskById,
    openCreatedTask,
    deleteTaskById,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $unplacedTasks,
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTaskId,
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.updatedTaskOpenedById,
    $$taskDisclosure.createdTaskOpened,
    $$deleteTask.taskDeletedById,
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  return (
    <Layout>
      <Layout.Header iconName="common/cross-arrows" title="Unplaced" />
      <Layout.Content onClick={(e) => onClickOutside(taskRef, e, closeTask)}>
        {unplacedTasks?.map((task, id) => {
          return (
            <div className="px-3 pb-1" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  dateLabel
                  onUpdateDate={changeDateAndUpdate}
                  onUpdateStatus={changeStatusAndUpdate}
                  isTaskSelected={selectedTask?.id === task.id}
                  onClick={selectTask}
                  onDoubleClick={() => openUpdatedTaskById(task.id)}
                  task={task}
                />
              )}
            </div>
          )
        })}
        <NoTasks isTaskListEmpty={!unplacedTasks?.length && !createdTask} />
        <div className="mx-3">
          {createdTask && (
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={false}
              taskRef={taskRef}
            />
          )}
        </div>
      </Layout.Content>
      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTaskById(selectedTask.id)}
        action={() => openCreatedTask()}
      />
    </Layout>
  )
}
