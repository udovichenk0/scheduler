import { useUnit } from "effector-react"
import { RefObject, Suspense, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"
import {
  useDocumentTitle,
  onClickOutside,
  clickOnElement,
} from "@/shared/lib/react"

import {
  $$deleteTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  toggleOverdueTasksOpened,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
  $$selectTask,
} from "./today.model"

const Today = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.today"))
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<HTMLDivElement>(null)

  const closeTask = useUnit($$taskDisclosure.closeTaskTriggered)
  const openCreatedTask = useUnit($$taskDisclosure.createdTaskOpened)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const deleteTaskById = useUnit($$deleteTask.taskDeletedById)
  const selectedTaskId = useUnit($$selectTask.$selectedTaskId)
  const selectTaskById = useUnit($$selectTask.taskIdSelected)
  const overdueTasks = useUnit($overdueTasks)
  const todayTasks = useUnit($todayTasks)

  return (
    <Suspense fallback={<div>loading</div>}>
      <Layout>
        <Layout.Header
          iconName="common/outlined-star"
          title={t("task.today")}
        />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            onClickOutside(expandedTaskRef, e, closeTask)
            clickOnElement(taskItemRef, e, () => selectTaskById(null))
          }}
        >
          <OverdueTasks
            taskRef={expandedTaskRef}
            selectTaskId={selectTaskById}
            selectedTaskId={selectedTaskId}
          />
          <TodayTasks
            taskRef={expandedTaskRef}
            selectTaskId={selectTaskById}
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

  const updatedTask = useUnit($$taskDisclosure.$updatedTaskId)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const isOverdueTasksOpened = useUnit($isOverdueTasksOpened)
  const toggleOverdueTasks = useUnit(toggleOverdueTasksOpened) // Assuming this is a function
  const overdueTasks = useUnit($overdueTasks)
  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)

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
                    onClick={() => selectTaskId(task.id)}
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

  const todayTasks = useUnit($todayTasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const overdueTasks = useUnit($overdueTasks)
  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)

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
                  onClick={() => selectTaskId(task.id)}
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
