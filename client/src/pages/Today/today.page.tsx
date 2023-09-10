import { useUnit } from "effector-react"
import { RefObject, useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { TaskItem } from "@/entities/task/task-item"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { NoTasks } from "@/shared/ui/no-tasks"

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

export const Today = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
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
    <Layout>
      <Layout.Header iconName="common/outlined-star" title="Today" />
      <Layout.Content onClick={(e) => onClickOutside(taskRef, e, closeTask)}>
        <OverdueTasks
          taskRef={taskRef}
          selectTask={selectTask}
          selectedTask={selectedTask}
        />
        <TodayTasks
          taskRef={taskRef}
          selectTask={selectTask}
          selectedTask={selectedTask}
        />
        <NoTasks
          isTaskListEmpty={
            !todayTasks.length && !overdueTasks.length && !createdTask
          }
        />
      </Layout.Content>
      <Layout.Footer
        action={() => openCreatedTask()}
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTaskById(selectedTask.id)}
      />
    </Layout>
  )
}

const OverdueTasks = ({
  selectTask,
  selectedTask,
  taskRef,
}: {
  selectTask: (task: Nullable<{ id: string }>) => void
  selectedTask: Nullable<{ id: string }>
  taskRef: RefObject<HTMLDivElement>
}) => {
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
          <span className="text-[18px]">Overdue tasks</span>
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
                  />
                ) : (
                  <TaskItem
                    dateLabel
                    typeLabel
                    onUpdateDate={changeDateAndUpdate}
                    onUpdateStatus={changeStatusAndUpdate}
                    isTaskSelected={selectedTask?.id === task.id}
                    onClick={selectTask}
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
  selectedTask,
  selectTask,
  taskRef,
}: {
  taskRef: RefObject<HTMLDivElement>
  selectedTask: Nullable<{ id: string }>
  selectTask: (task: Nullable<{ id: string }>) => void
}) => {
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
            <span className="text-[18px]">Today</span>
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
                  dateModifier
                />
              ) : (
                <TaskItem
                  typeLabel
                  onUpdateDate={changeDateAndUpdate}
                  onUpdateStatus={changeStatusAndUpdate}
                  isTaskSelected={selectedTask?.id === task.id}
                  onClick={selectTask}
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
