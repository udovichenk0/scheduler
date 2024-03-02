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
import { Button } from "@/shared/ui/buttons/main-button"

const Trash = () => {
  const taskItemRef = useRef<HTMLDivElement>(null)
  useDocumentTitle(t("task.trash"))

  const tasks = useUnit($trashTasks)
  const selectedTaskId = useUnit($selectedTaskId)

  const onSelectTaskId = useUnit(selectTaskId)
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
              size={'xs'} 
              className="flex items-center gap-x-2">
              <Cross/>
              {t("action.clearBucket")}
            </Button>
          }
          iconName="common/inbox" 
          title={t("task.trash")} />
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
const Cross = () => {
  return (
    <div className="w-[10px] h-[10px] mt-[2px] relative
      after:content-[''] after:left-1/2 after:bottom-0 after:absolute after:w-[2px] after:h-3 after:bg-accent after:rotate-45
      before:content-[''] before:left-1/2 before:bottom-0 before:absolute before:w-[2px] before:h-3 before:bg-accent before:-rotate-45
    "></div>
  )
}
export default Trash
