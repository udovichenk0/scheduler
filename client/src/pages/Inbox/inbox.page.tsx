import { useUnit } from "effector-react"
import { Suspense, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { TaskItem, Sort } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import {
  clickOnElement,
  useDocumentTitle,
  onClickOutside,
} from "@/shared/lib/react"

import {
  $$trashTask,
  $inboxTasks,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
  $$sort,
  selectTaskId,
  $selectedTaskId,
} from "./inbox.model"
import { SORT_CONFIG } from "./config"

const Inbox = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.inbox"))

  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<HTMLDivElement>(null)

  const tasks = useUnit($inboxTasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const selectedTaskId = useUnit($selectedTaskId)
  const activeSort = useUnit($$sort.$sortType)

  const onCloseTaskForm = useUnit($$taskDisclosure.closeTaskTriggered)
  const onUpdateTaskFormOpen = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const onCreateTaskFormOpen = useUnit($$taskDisclosure.createdTaskOpened)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onChangeTaskStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onChangeTaskDate = useUnit($$updateTask.dateChangedAndUpdated)
  const onSelectTaskId = useUnit(selectTaskId)
  const onSortChange = useUnit($$sort.sort)

  return (
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header
          slot={<Sort sorting={{
            onChange: onSortChange,
            active: activeSort,
            config: SORT_CONFIG,
          }}/>}
          iconName="common/inbox"
          title={t("task.inbox")}
        />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            onClickOutside(expandedTaskRef, e, onCloseTaskForm)
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
                    onUpdateDate={onChangeTaskDate}
                    onUpdateStatus={onChangeTaskStatus}
                    isTaskSelected={selectedTaskId === task.id}
                    onClick={() => onSelectTaskId(task.id)}
                    onDoubleClick={() => onUpdateTaskFormOpen(task.id)}
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
          onDeleteTask={onDeleteTask}
          onCreateTask={onCreateTaskFormOpen}
        />
      </Layout>
    </Suspense>
  )
}

export default Inbox
