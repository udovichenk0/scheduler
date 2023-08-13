import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

import { onClickOutside } from "@/shared/lib/on-click-outside"

import {
  $$deleteTask,
  $inboxTasks,
  $$createTask,
  $$taskDisclosure,
  $$updateTask,
} from "./inbox.model"

export const Inbox = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [
    tasks,
    newTask,
    taskId,
    closeTaskTriggered,
    updateTaskOpened,
    createTaskOpened,
    deleteTask,
  ] = useUnit([
    $inboxTasks,
    $$taskDisclosure.$newTask,
    $$taskDisclosure.$taskId,
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.updateTaskOpened,
    $$taskDisclosure.createTaskToggled,
    $$deleteTask.taskDeleted,
  ])
  return (
    <Layout>
      <Layout.Header iconName="common/inbox" title="Inbox" />
      <Layout.Content
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
      >
        <List
          $$updateTask={$$updateTask}
          taskId={taskId}
          tasks={tasks}
          openTask={updateTaskOpened}
          dateModifier={false}
          taskRef={ref}
          selectedTask={selectedTask}
          selectTask={selectTask}
        />
        <div className="mx-5">
          {newTask && (
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={false}
              taskRef={ref}
            />
          )}
        </div>
      </Layout.Content>

      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened({ date: new Date() })}
      />
    </Layout>
  )
}
