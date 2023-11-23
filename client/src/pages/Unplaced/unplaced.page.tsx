import { useUnit } from "effector-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { TaskItem } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import { useDocumentTitle, onClickOutside } from "@/shared/lib/react"

import {
  $$createTask,
  $$deleteTask,
  $$selectTask,
  $$taskDisclosure,
  $$updateTask,
  $unplacedTasks,
} from "./unplaced.model"

const Unplaced = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.unplaced"))
  const taskRef = useRef<HTMLDivElement>(null)

  const unplacedTasks = useUnit($unplacedTasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const closeTask = useUnit($$taskDisclosure.closeTaskTriggered)
  const openUpdatedTaskById = useUnit($$taskDisclosure.updatedTaskOpenedById)
  const openCreatedTask = useUnit($$taskDisclosure.createdTaskOpened)
  const deleteTaskById = useUnit($$deleteTask.taskDeletedById)
  const changeStatusAndUpdate = useUnit($$updateTask.statusChangedAndUpdated)
  const changeDateAndUpdate = useUnit($$updateTask.dateChangedAndUpdated)
  const selectedTaskId = useUnit($$selectTask.$selectedTaskId)
  const selectTaskId = useUnit($$selectTask.taskIdSelected)

  return (
    <Layout>
      <Layout.Header
        iconName="common/cross-arrows"
        title={t("task.unplaced")}
      />
      <Layout.Content onClick={(e) => onClickOutside(taskRef, e, closeTask)}>
        {unplacedTasks?.map((task, id) => {
          return (
            <div className="px-3 pb-1" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  dateLabel
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
        <NoTasks isTaskListEmpty={!unplacedTasks?.length && !createdTask} />
        <div className="mx-3">
          {createdTask && (
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={false}
              taskRef={taskRef}
            />
          )}
        </div>
      </Layout.Content>
      <Layout.Footer
        selectedTaskId={selectedTaskId}
        deleteTask={deleteTaskById}
        action={openCreatedTask}
      />
    </Layout>
  )
}

export default Unplaced
