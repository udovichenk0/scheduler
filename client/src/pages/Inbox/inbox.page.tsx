import { useUnit } from "effector-react"
import { Suspense, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import {
  clickOnElement,
  useDocumentTitle,
  onClickOutside,
} from "@/shared/lib/react"

import {
  $$deleteTask,
  $inboxTasks,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
  $$selectTask,
} from "./inbox.model"

const Inbox = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.inbox"))
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<HTMLDivElement>(null)
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
    selectTaskId,
    selectedTaskId,
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
    $$selectTask.taskIdSelected,
    $$selectTask.$selectedTaskId,
  ])
  return (
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header iconName="common/inbox" title={t("task.inbox")} />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            onClickOutside(expandedTaskRef, e, closeTask)
            clickOnElement(taskItemRef, e, () => selectTaskId(null))
          }}
        >
          {tasks?.map((task, id) => {
            return (
              <div className="px-3 pb-1 first:pt-2 last:pb-2" key={id}>
                {task.id === updatedTaskId ? (
                  <ExpandedTask
                    dateModifier={false}
                    modifyTaskModel={$$updateTask}
                    taskRef={expandedTaskRef}
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
                taskRef={expandedTaskRef}
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
