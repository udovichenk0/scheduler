import { useGate, useList, useUnit } from "effector-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main/ui.tsx"
import { EditableTask } from "@/widgets/editable-task"

import { Sort } from "@/entities/task/ui/sorting.tsx"
import { CompletedToggle } from "@/entities/task/ui/toggle-completed"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { NoTasks } from "@/shared/ui/no-tasks"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { useDocumentTitle } from "@/shared/lib/react/use-document.title.ts"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useSelectItem } from "@/shared/lib/use-select-item"

import { SORT_CONFIG } from "./config"
import {
  $$trashTask,
  $overdueTasks,
  $todayTasks,
  toggleOverdueTasksOpened,
  $$updateTask,
  $$createTask,
  $$sort,
  $$taskModel,
  gate,
  $isOverdueExpanded,
} from "./model"

const Today = () => {
  const { t } = useTranslation()
  useDocumentTitle(t("task.today"))
  const activeSort = useUnit($$sort.$sortType)

  const onSortChange = useUnit($$sort.sort)

  const isCompletedShown = useUnit($$taskModel.$isCompletedShown)
  const onToggleCompleted = useUnit($$taskModel.toggleCompletedShown)
  const overdueTasks = useUnit($overdueTasks)
  const todayTasks = useUnit($todayTasks)

  const onDeleteTask = useUnit($$trashTask.taskTrashedById)
  const { isOpened, open: onOpen } = useDisclosure({
    id: ModalName.CreateTaskForm,
  })

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
            <CompletedToggle
              checked={isCompletedShown}
              onToggle={onToggleCompleted}
            />
          </>
        }
      />
      <Layout.Content className="flex flex-col">
        <OverdueTasks onSelectTaskId={setSelectedTaskId} />
        <TodayTasks onSelectTaskId={setSelectedTaskId} />
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

  const isExpanded = useUnit($isOverdueExpanded)
  const tasks = useUnit($overdueTasks)

  const onToggleVisibility = useUnit(toggleOverdueTasksOpened)

  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null),
  })

  const list = useList($overdueTasks, (task, index) => {
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
  })

  return (
    <section className={`${tasks?.length ? "block" : "hidden"}`}>
      <div className="border-b-1 border-t-1 border-cBorder flex items-center gap-1 px-5 py-2">
        <Icon
          name="common/outlined-star"
          className="text-cIconDefault mr-1 h-5 w-5"
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
      {isExpanded && <div className="mt-2 px-3">{list}</div>}
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
  const { isOpened: isCreateTaskFormOpened, close: onCloseCreateTaskForm } =
    useDisclosure({ id: ModalName.CreateTaskForm, onClose: onCreateTask })
  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => onSelectTaskId(task?.id || null),
  })
  const list = useList($todayTasks, (task, index) => {
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
  })

  return (
    <section>
      {!!overdueTasks?.length && !!tasks?.length && (
        <div
          className={`border-b-1 border-cBorder text-primary mb-2 flex items-center gap-1 px-5 py-2`}
        >
          <Icon
            name="common/outlined-star"
            className="text-accent mr-1 h-5 w-5"
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
      <div className="mx-3">{list}</div>
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
