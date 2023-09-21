import { useUnit } from "effector-react"
import { RefObject, Suspense, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem } from "@/entities/task/task-item"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"
import { useDocumentTitle } from "@/shared/lib/react"

import {
  $$deleteTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  toggleOverdueTasksOpened,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
} from "./today.model"

const Today = () => {
  const [selectedTaskId, selectTaskId] = useState<Nullable<TaskId>>(null)
  const { t } = useTranslation()
  useDocumentTitle(t('task.today'))
  const taskRef = useRef<HTMLDivElement>(null)
  const [
    closeTask,
    openCreatedTask,
    createdTask,
    deleteTaskById,
    overdueTasks,
    todayTasks,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    $$taskDisclosure.$createdTask,
    $$deleteTask.taskDeletedById,
    $overdueTasks,
    $todayTasks,
  ])
  return (
    <Suspense fallback={<div>loading</div>}>
      <Layout>
        <Layout.Header
          iconName="common/outlined-star"
          title={t("task.today")}
        />
        <Layout.Content onClick={(e) => onClickOutside(taskRef, e, closeTask)}>
          <OverdueTasks
            taskRef={taskRef}
            selectTaskId={selectTaskId}
            selectedTaskId={selectedTaskId}
          />
          <TodayTasks
            taskRef={taskRef}
            selectTaskId={selectTaskId}
            selectedTaskId={selectedTaskId}
          />
          <NoTasks
            isTaskListEmpty={
              !todayTasks.length && !overdueTasks.length && !createdTask
            }
          />
        </Layout.Content>
        <Layout.Footer
          action={openCreatedTask}
          selectedTaskId={selectedTaskId}
          deleteTask={deleteTaskById}
        />
      </Layout>
    </Suspense>
  )
}

const OverdueTasks = ({
  selectTaskId,
  selectedTaskId,
  taskRef,
}: {
  selectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  taskRef: RefObject<HTMLDivElement>
}) => {
  const { t } = useTranslation()
  const [
    updatedTask,
    openUpdatedTaskById,
    isOverdueTasksOpened,
    toggleOverdueTasks,
    overdueTasks,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $$taskDisclosure.$updatedTaskId,
    $$taskDisclosure.updatedTaskOpenedById,
    $isOverdueTasksOpened,
    toggleOverdueTasksOpened,
    $overdueTasks,
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  return (
    <section className={`${overdueTasks.length > 0 ? "block" : "hidden"}`}>
      <div className="flex items-center gap-1 border-b-2 border-t-2 border-cBorder px-5 py-2">
        <Icon
          name="common/outlined-star"
          className="mr-1 h-5 w-5 text-cIconDefault"
        />
        <Button
          intent={"primary"}
          size={"sm"}
          onClick={toggleOverdueTasks}
          className="flex w-full items-center justify-between px-3"
        >
          <span className="text-[18px]">{t("today.overdueTasks")}</span>
          <span>
            <span className="mr-3 text-[12px]">
              {!isOverdueTasksOpened && overdueTasks.length}
            </span>
            <Icon
              name="common/arrow"
              className={`text-[12px] ${
                isOverdueTasksOpened ? "rotate-180" : "rotate-90"
              }`}
            />
          </span>
        </Button>
      </div>
      <div>
        {isOverdueTasksOpened &&
          overdueTasks.map((task, id) => {
            return (
              <div
                className="px-3 first:pt-2 [&:not(:last-child)]:pb-1"
                key={id}
              >
                {task.id === updatedTask ? (
                  <ExpandedTask
                    modifyTaskModel={$$updateTask}
                    taskRef={taskRef}
                    dateModifier
                  />
                ) : (
                  <TaskItem
                    dateLabel
                    typeLabel
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
      </div>
    </section>
  )
}

const TodayTasks = ({
  selectedTaskId,
  selectTaskId,
  taskRef,
}: {
  taskRef: RefObject<HTMLDivElement>
  selectedTaskId: Nullable<TaskId>
  selectTaskId: (task: Nullable<TaskId>) => void
}) => {
  const { t } = useTranslation()
  const [
    todayTasks,
    createdTask,
    updatedTaskId,
    openUpdatedTaskById,
    overdueTasks,
    changeStatusAndUpdate,
    changeDateAndUpdate,
  ] = useUnit([
    $todayTasks,
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTaskId,
    $$taskDisclosure.updatedTaskOpenedById,
    $overdueTasks,
    $$updateTask.statusChangedAndUpdated,
    $$updateTask.dateChangedAndUpdated,
  ])
  return (
    <section>
      {!!overdueTasks.length && !!todayTasks.length && (
        <div
          className={`flex items-center gap-1 border-b-2 border-cBorder px-5 py-2 text-primary `}
        >
          <Icon
            name="common/outlined-star"
            className="mr-1 h-5 w-5 text-accent"
          />
          <Button
            intent={"primary"}
            size={"sm"}
            className="flex w-full items-center text-start"
          >
            <span className="text-[18px]">{t("task.today")}</span>
          </Button>
        </div>
      )}
      <div>
        {todayTasks.map((task, id) => {
          return (
            <div className="px-3 pb-1 first:pt-2 last:pb-2" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  typeLabel
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
      </div>
      <div className="mx-3">
        {createdTask && (
          <ExpandedTask
            modifyTaskModel={$$createTask}
            dateModifier={true}
            taskRef={taskRef}
          />
        )}
      </div>
    </section>
  )
}

export default Today
