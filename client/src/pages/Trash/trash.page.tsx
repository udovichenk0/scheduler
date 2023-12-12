import { t } from "i18next"
import { Suspense, useRef } from "react"
import { useUnit } from "effector-react"

import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { clickOnElement, useDocumentTitle } from "@/shared/lib/react"
import { NoTasks } from "@/shared/ui/no-tasks"

import {
  $$deleteTask,
  $selectedTaskId,
  $trashTasks,
  selectTaskId,
} from "./trash.model"

const Trash = () => {
  const taskItemRef = useRef<HTMLDivElement>(null)
  useDocumentTitle(t("task.trash"))

  const tasks = useUnit($trashTasks)
  const selectedTaskId = useUnit($selectedTaskId)

  const onSelectTaskId = useUnit(selectTaskId)
  const onDeleteTask = useUnit($$deleteTask.taskDeletedById)
  return (
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header iconName="common/inbox" title={t("task.trash")} />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            clickOnElement(taskItemRef, e, () => onSelectTaskId(null))
          }}
        >
          {tasks?.map((task, id) => {
            return (
              <div className="px-3 pb-2" key={id}>
                <TaskItem
                  typeLabel
                  dateLabel
                  isTaskSelected={selectedTaskId === task.id}
                  onClick={() => onSelectTaskId(task.id)}
                  task={task}
                />
              </div>
            )
          })}
          <NoTasks isTaskListEmpty={!tasks?.length} />
        </Layout.Content>

        <Layout.Footer
          selectedTaskId={selectedTaskId}
          onDeleteTask={onDeleteTask}
        />
      </Layout>
    </Suspense>
  )
}

export default Trash
