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
  $$filter,
  selectTaskId,
  $selectedTaskId,
} from "./inbox.model"
import { FILTER_CONFIG } from "./config"

const Inbox = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.inbox"))

  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<HTMLDivElement>(null)

  const tasks = useUnit($inboxTasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const closeTask = useUnit($$taskDisclosure.closeTaskTriggered)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const openCreatedTask = useUnit($$taskDisclosure.createdTaskOpened)
  const deleteTaskById = useUnit($$deleteTask.taskDeletedById)

  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)

  const onSelectTaskId = useUnit(selectTaskId)
  const selectedTaskId = useUnit($selectedTaskId)

  const onFilterSelect = useUnit($$filter.sort)
  const activeFilter = useUnit($$filter.$sortType)

  return (
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header
          filter={{
            onChange: onFilterSelect,
            active: activeFilter,
            config: FILTER_CONFIG,
          }}
          iconName="common/inbox"
          title={t("task.inbox")}
        />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            onClickOutside(expandedTaskRef, e, closeTask)
            clickOnElement(taskItemRef, e, () => onSelectTaskId(null))
          }}
        >
          {tasks?.map((task, id) => {
            return (
              <div className="px-3 pb-2" key={id}>
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
                    onClick={() => onSelectTaskId(task.id)}
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
