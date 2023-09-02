import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

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
    tasks,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
    deleteTask,
  ] = useUnit([
    $unplacedTasks,
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTask,
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.updatedTaskOpened,
    $$taskDisclosure.createdTaskOpened,
    $$deleteTask.taskDeleted,
  ])
  return (
    <Layout>
      <Layout.Header iconName="common/cross-arrows" title="Unplaced" />
      <Layout.Content
        onClick={(e) => onClickOutside(taskRef, e, closeTaskTriggered)}
      >
        <List
          $$updateTask={$$updateTask}
          updatedTaskId={taskId?.id || null}
          tasks={tasks}
          openTask={updateTaskOpened}
          taskRef={taskRef}
          selectedTask={selectedTask}
          selectTask={selectTask}
        />
        <NoTasks isTaskListEmpty={!tasks?.length} />
        <div className="mx-5">
          {newTask && (
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
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened()}
      />
    </Layout>
  )
}
