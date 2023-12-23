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
  $$trashTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  toggleOverdueTasksOpened,
  $$taskDisclosure,
  $$updateTask,
  $$createTask,
  $$sort,
  $selectedTaskId,
  selectTaskId,
} from "./today.model"
import { SORT_CONFIG } from "./config"

const Today = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.today"))
  const expandedTaskRef = useRef<HTMLDivElement>(null)
  const taskItemRef = useRef<HTMLDivElement>(null)

  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const overdueTasks = useUnit($overdueTasks)
  const todayTasks = useUnit($todayTasks)
  const selectedTaskId = useUnit($selectedTaskId)
  const activeSort = useUnit($$sort.$sortType)

  const onCloseTaskForm = useUnit($$taskDisclosure.closeTaskTriggered)
  const onCreateTaskFormOpen = useUnit($$taskDisclosure.createdTaskOpened)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSelectTaskId = useUnit(selectTaskId)
  const onSortChange = useUnit($$sort.sort)

  return (
    <Suspense fallback={<div>loading</div>}>
      <Layout>
        <Layout.Header
          iconName="common/outlined-star"
          title={t("task.today")}
          sorting={{
            onChange: onSortChange,
            active: activeSort,
            config: SORT_CONFIG,
          }}
        />
        <Layout.Content
          contentRef={taskItemRef}
          className="flex flex-col"
          onClick={(e) => {
            onClickOutside(expandedTaskRef, e, onCloseTaskForm)
            clickOnElement(taskItemRef, e, () => onSelectTaskId(null))
          }}
        >
          <OverdueTasks
            taskRef={expandedTaskRef}
            onSelectTaskId={onSelectTaskId}
            selectedTaskId={selectedTaskId}
          />
          <TodayTasks
            taskRef={expandedTaskRef}
            onSelectTaskId={onSelectTaskId}
            selectedTaskId={selectedTaskId}
          />
          <NoTasks
            isTaskListEmpty={
              !todayTasks.length && !overdueTasks.length && !createdTask
            }
          />
        </Layout.Content>
        <Layout.Footer
          onCreateTask={onCreateTaskFormOpen}
          selectedTaskId={selectedTaskId}
          onDeleteTask={onDeleteTask}
        />
      </Layout>
    </Suspense>
  )
}

const OverdueTasks = ({
  onSelectTaskId,
  selectedTaskId,
  taskRef,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  taskRef: RefObject<HTMLDivElement>
}) => {
  const { t } = useTranslation()

  const updatedTask = useUnit($$taskDisclosure.$updatedTaskId)
  const isOverdueTasksOpened = useUnit($isOverdueTasksOpened)
  const overdueTasks = useUnit($overdueTasks)

  const onUpdateTaskFormOpen = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const onToggleVisibility = useUnit(toggleOverdueTasksOpened) // Assuming this is a function
  const onChangeStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onChangeDate = useUnit($$updateTask.dateChangedAndUpdated)

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
          onClick={onToggleVisibility}
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
              <div className="px-3 pb-2" key={id}>
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
                    onUpdateDate={onChangeDate}
                    onUpdateStatus={onChangeStatus}
                    isTaskSelected={selectedTaskId === task.id}
                    onClick={() => onSelectTaskId(task.id)}
                    onDoubleClick={() => onUpdateTaskFormOpen(task.id)}
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
  onSelectTaskId,
  selectedTaskId,
  taskRef,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  taskRef: RefObject<HTMLDivElement>
}) => {
  const { t } = useTranslation()

  const todayTasks = useUnit($todayTasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const overdueTasks = useUnit($overdueTasks)

  const onUpdateTaskFormOpen = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const onChangeStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onChangeDate = useUnit($$updateTask.dateChangedAndUpdated)

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
            <div className="px-3 pb-2" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  typeLabel
                  onUpdateDate={onChangeDate}
                  onUpdateStatus={onChangeStatus}
                  isTaskSelected={selectedTaskId === task.id}
                  onClick={() => onSelectTaskId(task.id)}
                  onDoubleClick={() => onUpdateTaskFormOpen(task.id)}
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
