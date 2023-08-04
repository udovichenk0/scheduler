import { useUnit } from "effector-react"
import { RefObject, useRef, useState } from "react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"
import { List } from "@/widgets/task-list"

import { ModifyTaskForm } from "@/entities/task/modify"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

import {
  $$deleteTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  $$createTask,
  $$taskAccordion,
  toggleOverdueTasksOpened,
  $$updateTask,
} from "./today.model"

export const Today = () => {
  const [selectedTask, selectTask] = useState<Nullable<{ id: number }>>(null)
  const taskRef = useRef<HTMLDivElement>(null)
  const [closeTaskTriggered, createTaskOpened, deleteTask] = useUnit([
    $$taskAccordion.closeTaskTriggered,
    $$taskAccordion.createTaskToggled,
    $$deleteTask.taskDeleted,
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
      </Layout.Content>
      <Layout.Footer
        action={() => createTaskOpened({ date: new Date() })}
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
  selectTask: (task: Nullable<{ id: number }>) => void
  selectedTask: Nullable<{ id: number }>
  taskRef: RefObject<HTMLDivElement>
}) => {
  const [
    taskId,
    updateTaskOpened,
    isOverdueTasksOpened,
    toggleOverdueTasks,
    overdueTasks,
  ] = useUnit([
    $$taskAccordion.$taskId,
    $$taskAccordion.updateTaskOpened,
    $isOverdueTasksOpened,
    toggleOverdueTasksOpened,
    $overdueTasks,
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
              className={`w-[6px] ${isOverdueTasksOpened ? "rotate-90" : ""}`}
            />
          </span>
        </Button>
      </div>
      {!!isOverdueTasksOpened && (
        <List
          className="border-b-2 border-cBorder"
          $$updateTask={$$updateTask}
          taskId={taskId}
          tasks={overdueTasks}
          openTask={updateTaskOpened}
          taskRef={taskRef}
          selectedTask={selectedTask}
          selectTask={selectTask}
        />
      )}
    </section>
  )
}

const TodayTasks = ({
  taskRef,
  selectedTask,
  selectTask,
}: {
  taskRef: RefObject<HTMLDivElement>
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
}) => {
  const [tasks, newTask, taskId, updateTaskOpened, overdueTasks] = useUnit([
    $todayTasks,
    $$taskAccordion.$newTask,
    $$taskAccordion.$taskId,
    $$taskAccordion.updateTaskOpened,
    $overdueTasks,
  ])
  return (
    <section>
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
        taskId={taskId}
        tasks={tasks}
        openTask={updateTaskOpened}
        taskRef={taskRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />
      {newTask && (
        <ExpandedTask taskRef={taskRef}>
          <ModifyTaskForm modifyTaskModel={$$createTask} />
        </ExpandedTask>
      )}
    </section>
  )
}
