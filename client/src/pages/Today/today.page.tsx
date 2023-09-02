import { useUnit } from "effector-react"
import { RefObject, useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

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
    closeTaskTriggered,
    createTaskOpened,
    deleteTask,
    overdueTasks,
    todayTasks,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    $$deleteTask.taskDeleted,
    $overdueTasks,
    $todayTasks,
  ])

  return (
    <Layout>
      <Layout.Header iconName="common/outlined-star" title="Today" />
      <Layout.Content
        onClick={(e) => onClickOutside(taskRef, e, closeTaskTriggered)}
      >
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
        <NoTasks isTaskListEmpty={!todayTasks.length && !overdueTasks.length} />
      </Layout.Content>
      <Layout.Footer
        action={() => createTaskOpened()}
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
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
    taskId,
    updateTaskOpened,
    isOverdueTasksOpened,
    toggleOverdueTasks,
    overdueTasks,
  ] = useUnit([
    $$taskDisclosure.$updatedTask,
    $$taskDisclosure.updatedTaskOpened,
    $isOverdueTasksOpened,
    toggleOverdueTasksOpened,
    $overdueTasks,
  ])
  return (
    <section
      className={`h-full ${overdueTasks.length > 0 ? "block" : "hidden"}`}
    >
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
      {!!isOverdueTasksOpened && (
        <List
          className="border-b-2 border-cBorder"
          $$updateTask={$$updateTask}
          updatedTaskId={taskId?.id || null}
          tasks={overdueTasks}
          openTask={updateTaskOpened}
          taskRef={taskRef}
          selectedTask={selectedTask}
          selectTask={selectTask}
          dateLabel
        />
      )}
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
  const [tasks, newTask, taskId, updateTaskOpened, overdueTasks] = useUnit([
    $todayTasks,
    $$taskDisclosure.$createdTask,
    $$taskDisclosure.$updatedTask,
    $$taskDisclosure.updatedTaskOpened,
    $overdueTasks,
  ])
  return (
    <section className="">
      {!!overdueTasks.length && !!tasks.length && (
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
      <List
        $$updateTask={$$updateTask}
        updatedTaskId={taskId?.id || null}
        tasks={tasks}
        openTask={updateTaskOpened}
        taskRef={taskRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
        typeLabel
      />
      <div className="mx-5">
        {newTask && (
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
