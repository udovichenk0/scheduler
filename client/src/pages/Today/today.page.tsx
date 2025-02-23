import { useGate, useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { Sort } from "@/entities/task"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task"
import {
  useDocumentTitle,
} from "@/shared/lib/react"

import {
  $$trashTask,
  $isOverdueTasksOpened,
  $overdueTasks,
  $todayTasks,
  toggleOverdueTasksOpened,
  $$updateTask,
  $$createTask,
  $$sort,
  $$taskModel,
  gate,
} from "./today.model"
import { SORT_CONFIG } from "./config"
import { useDisclosure } from "@/shared/lib/modal/use-modal"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { EditableTask } from "@/widgets/editable-task"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"
import { useSelectItem } from "@/shared/lib/use-select-item"
import { useState } from "react"

const Today = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.today"))

  const overdueTasks = useUnit($overdueTasks)
  const todayTasks = useUnit($todayTasks)
  const activeSort = useUnit($$sort.$sortType)

  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const onSortChange = useUnit($$sort.sort)
  const { isOpened, open: onOpen } = useDisclosure({id: ModalName.CreateTaskForm})

  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<string>>(null)
  useGate(gate)


  return (
    <Layout>
      <Layout.Header
        iconName="common/outlined-star"
        title={t("task.today")}
        slot={
          <>
          <Sort
            sorting={{
              onChange: onSortChange,
              active: activeSort,
              config: SORT_CONFIG,
            }}
          />
          <CompletedToggle checked={isCompletedShown} onToggle={onToggleCompleted}/>
          </>
        }
      />
      <Layout.Content className="flex flex-col">
        <OverdueTasks onSelectTaskId={setSelectedTaskId}/>
        <TodayTasks onSelectTaskId={setSelectedTaskId}/>
        <NoTasks
          isTaskListEmpty={
            !todayTasks?.length && !overdueTasks?.length && !isOpened
          }
        />
      </Layout.Content>
      <Layout.Footer
        onCreateTask={onOpen}
        isTrashDisabled={!selectedTaskId}
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
      />
    </Layout>
  )
}

const OverdueTasks = ({
  onSelectTaskId,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
}) => {
  const { t } = useTranslation()

  const isExpanded = useUnit($isOverdueTasksOpened)
  const tasks = useUnit($overdueTasks)

  const onToggleVisibility = useUnit(toggleOverdueTasksOpened)

  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null)
  })

  return (
    <section className={`${tasks?.length ? "block" : "hidden"}`}>
      <div className="flex items-center gap-1 border-b-1 border-t-1 border-cBorder px-5 py-2">
        <Icon
          name="common/outlined-star"
          className="mr-1 h-5 w-5 text-cIconDefault"
        />
        <Button
          aria-expanded={isExpanded}
          intent={"primary"}
          size={"sm"}

          onClick={onToggleVisibility}
          className="flex w-full items-center justify-between px-2"
        >
          <span className="text-[18px]">{t("today.overdueTasks")}</span>
          <span>
            <span className="mr-3 text-[12px]">
              {!isExpanded && tasks?.length}
            </span>
            <Icon
              name="common/arrow"
              className={`text-[12px] ${
                isExpanded ? "rotate-180" : "rotate-90"
              }`}
            />
          </span>
        </Button>
      </div>
        {isExpanded && (
          <div className="mt-2 px-3">
            {tasks?.map((task, index) => {
                return (
                  <EditableTask
                    ref={(node) => addNode(node!, index)}
                    key={task.id}
                    dateLabel
                    typeLabel
                    task={task}
                    $$updateTask={$$updateTask}
                    onSelect={() => onSelect(index)}
                    onBlur={onUnselect}
                  />
                )
              })}
          </div>
        )}
    </section>
  )
}

const TodayTasks = ({
  onSelectTaskId,
}: {
  onSelectTaskId: (task: Nullable<TaskId>) => void
}) => {
  const { t } = useTranslation()
  const tasks = useUnit($todayTasks)
  const overdueTasks = useUnit($overdueTasks)

  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const {isOpened: isCreateTaskFormOpened, close: onCloseCreateTaskForm} = useDisclosure({id: ModalName.CreateTaskForm, onClose: onCreateTask})
  const {
    onSelect, 
    onUnselect, 
    addNode,
  } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null)
  })

  return (
    <section>
      {!!overdueTasks?.length && !!tasks?.length && (
        <div
          className={`flex items-center gap-1 border-b-1 border-cBorder px-5 py-2 text-primary mb-2`}
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
      <div className="mx-3">
        {tasks?.map((task, index) => {
          return (
            <EditableTask
              key={task.id}
              ref={(node) => addNode(node!, index)}
              task={task}
              typeLabel
              $$updateTask={$$updateTask}
              onSelect={() => onSelect(index)}
              onBlur={onUnselect}
            />
          )
        })}
      </div>
      <ExpandedTask
        className="mx-3"
        isExpanded={isCreateTaskFormOpened}
        closeTaskForm={onCloseCreateTaskForm}
        modifyTaskModel={$$createTask}
        dateModifier={true}
      />
    </section>
  )
}

export default Today
