import { useUnit } from "effector-react"
import { Suspense, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"
import { useDocumentTitle } from "@/shared/lib/react"

import {
  $$deleteTask,
  $inboxTasks,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
} from "./inbox.model"

const Inbox = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.inbox"))
  const [selectedTaskId, selectTaskId] = useState<Nullable<TaskId>>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [
    tasks,
    createdTask,
    updatedTaskId,
    closeTask,
    openUpdatedTaskById,
    openCreatedTask,
    deleteTaskById,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $inboxTasks,
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
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header iconName="common/inbox" title={t("task.inbox")} />
        <Layout.Content
          className="flex flex-col"
          onClick={(e) => onClickOutside(ref, e, closeTask)}
        >
          {tasks?.map((task, id) => {
            return (
              <div className="px-3 pb-1 first:pt-2 last:pb-2" key={id}>
                {task.id === updatedTaskId ? (
                  <ExpandedTask
                    dateModifier={false}
                    modifyTaskModel={$$updateTask}
                    taskRef={ref}
                  />
                ) : (
                  <TaskItem
                    onUpdateDate={changeDateAndUpdate}
                    onUpdateStatus={changeStatusAndUpdate}
                    isTaskSelected={selectedTaskId === task.id}
                    onClick={selectTaskId}
                    onDoubleClick={() => openUpdatedTaskById(task.id)}
                    task={task}
                  />
                )}
              </div>
            )
          })}
          <div className="mx-3">
            {createdTask && (
              <ExpandedTask
                modifyTaskModel={$$createTask}
                dateModifier={false}
                taskRef={ref}
              />
            )}
          </div>
          <NoTasks isTaskListEmpty={!tasks?.length && !createdTask} />
        </Layout.Content>

        <Layout.Footer
          selectedTaskId={selectedTaskId}
          deleteTask={deleteTaskById}
          action={openCreatedTask}
        />
      </Layout>
    </Suspense>
  )
}
export default Inbox
