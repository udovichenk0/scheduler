import { t } from "i18next"
import { Suspense, useRef } from "react"
import { useUnit } from "effector-react"

import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { clickOnElement, useDocumentTitle } from "@/shared/lib/react"
import { NoTasks } from "@/shared/ui/no-tasks"
import { Button } from "@/shared/ui/buttons/main-button"

import {
  $$deleteTask,
  $trashTasks,
  $$selectTask,
  $$idModal,
} from "./trash.model"

const Trash = () => {
  const taskItemRef = useRef<HTMLDivElement>(null)
  useDocumentTitle(t("task.trash"))

  const tasks = useUnit($trashTasks.$tasks)
  const selectedTaskId = useUnit($$selectTask.$selectedTaskId)

  const onSelectTaskId = useUnit($$selectTask.selectTaskId)
  const onDeleteTask = useUnit($$deleteTask.taskDeletedById)
  const onDeleteAllTasks = useUnit($$deleteTask.allTasksDeleted)
  return (
    <Suspense fallback={<div>inbox loading...</div>}>
      <Layout>
        <Layout.Header
          slot={
            <Button
              onClick={onDeleteAllTasks}
              intent={"accent"}
              size={"xs"}
              className="flex items-center gap-x-2"
            >
              <Cross />
              {t("action.clearBucket")}
            </Button>
          }
          iconName="common/inbox"
          title={t("task.trash")}
        />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) =>
            clickOnElement(taskItemRef, e, () => onSelectTaskId(null))
          }
        >
          {tasks?.map((task, id) => {
            return (
              <div className="px-3 pb-2" key={id}>
                <TaskItem
                  idModal={$$idModal}
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
const Cross = () => {
  return (
    <div
      className="relative mt-[2px] h-[10px] w-[10px]
      before:absolute before:bottom-0 before:left-1/2 before:h-3 before:w-[2px] before:-rotate-45 before:bg-accent before:content-['']
      after:absolute after:bottom-0 after:left-1/2 after:h-3 after:w-[2px] after:rotate-45 after:bg-accent after:content-['']
    "
    ></div>
  )
}
export default Trash
