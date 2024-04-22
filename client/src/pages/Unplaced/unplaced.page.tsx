import { useUnit } from "effector-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { Sort, TaskItem } from "@/entities/task/task-item"

import { NoTasks } from "@/shared/ui/no-tasks"
import { useDocumentTitle, onClickOutside } from "@/shared/lib/react"

import {
  $$createTask,
  $$trashTask,
  $$sort,
  $$taskDisclosure,
  $$updateTask,
  $$selectTask,
  $unplacedTasks,
  $$dateModal,
  $$idModal,
} from "./unplaced.model"
import { SORT_CONFIG } from "./config"

const Unplaced = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.unplaced"))
  const taskRef = useRef<HTMLDivElement>(null)

  const unplacedTasks = useUnit($unplacedTasks.$tasks)
  const createdTask = useUnit($$taskDisclosure.$createdTask)
  const updatedTaskId = useUnit($$taskDisclosure.$updatedTaskId)
  const selectedTaskId = useUnit($$selectTask.$selectedTaskId)
  const activeSort = useUnit($$sort.$sortType)

  const onSelectTaskId = useUnit($$selectTask.selectTaskId)
  const onCloseTaskForm = useUnit($$taskDisclosure.closeTaskTriggered)
  const onUpdateTaskFormOpen = useUnit($$taskDisclosure.updatedTaskOpened)
  const onCreateTaskFormOpen = useUnit($$taskDisclosure.createdTaskOpened)
  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onChangeStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onChangeDate = useUnit($$updateTask.dateChangedAndUpdated)
  const onSortChange = useUnit($$sort.sort)

  return (
    <Layout>
      <Layout.Header
        iconName="common/cross-arrows"
        title={t("task.unplaced")}
        slot={
          <Sort
            sorting={{
              onChange: onSortChange,
              active: activeSort,
              config: SORT_CONFIG,
            }}
          />
        }
      />
      <Layout.Content
        onClick={(e) => onClickOutside(taskRef, e, onCloseTaskForm)}
      >
        {unplacedTasks?.map((task, id) => {
          return (
            <div className="px-3 pb-2" key={id}>
              {task.id === updatedTaskId ? (
                <ExpandedTask
                  dateModal={$$dateModal}
                  modifyTaskModel={$$updateTask}
                  taskRef={taskRef}
                />
              ) : (
                <TaskItem
                  idModal={$$idModal}
                  dateLabel
                  onUpdateDate={onChangeDate}
                  onUpdateStatus={onChangeStatus}
                  isTaskSelected={selectedTaskId === task.id}
                  onClick={() => onSelectTaskId(task.id)}
                  onDoubleClick={() => onUpdateTaskFormOpen(task)}
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
              dateModal={$$dateModal}
              modifyTaskModel={$$createTask}
              dateModifier={false}
              taskRef={taskRef}
            />
          )}
        </div>
      </Layout.Content>
      <Layout.Footer
        selectedTaskId={selectedTaskId}
        onDeleteTask={onDeleteTask}
        onCreateTask={onCreateTaskFormOpen}
      />
    </Layout>
  )
}

export default Unplaced
