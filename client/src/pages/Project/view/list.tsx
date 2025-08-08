import { useStoreMap, useUnit } from "effector-react"
import { Store } from "effector"
import { useState } from "react"

import { EditableTask } from "@/widgets/editable-task"
import { ExpandedTask } from "@/widgets/expanded-task"

import { Task } from "@/entities/task/type"
import { TaskStatus, TaskType } from "@/entities/task/model/task.model"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
// import { TaskStatus } from "@/shared/api/scheduler.schemas"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { routes } from "@/shared/routing/router"

import { $$taskCreator, $$taskTrasher, $$taskUpdater } from "../model"

export const List = ({ $tasks }: { $tasks: Store<Nullable<Task[]>> }) => {
  const inprogressTasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => {
      if (!tasks) return []
      return tasks.filter((tasks) => tasks.status === TaskStatus.INPROGRESS)
    },
  })

  const completedTasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => {
      if (!tasks) return []
      return tasks.filter((tasks) => tasks.status === TaskStatus.FINISHED)
    },
  })

  return (
    <>
      <CompletedTasks tasks={completedTasks} />
      <InprogressTasks tasks={inprogressTasks} />
    </>
  )
}

const InprogressTasks = ({ tasks }: { tasks: Task[] }) => {
  const [isDisclosed, disclose] = useState(true)
  const onCreateTask = useUnit($$taskCreator.createTaskTriggered)
  const initFields = useUnit($$taskCreator.setFieldsTriggered)
  const params = useUnit(routes.project.$params)
  const {
    isOpened: isCreateFormOpened,
    open: onOpenCreateForm,
    close: onCloseCreateForm,
  } = useDisclosure({
    prefix: ModalName.CreateTaskForm,
    onClose: onCreateTask,
    onOpen: () => {
      initFields({
        project_id: params.projectId,
        type: TaskType.UNPLACED,
      })
    },
  })

  return (
    <>
      <Header
        title="Inprogress Tasks"
        onOpenCreateForm={onOpenCreateForm}
        color="cTaskEdit"
        isDisclosed={isDisclosed}
        disclose={disclose}
        display={!!tasks.length}
      />
      <ExpandedTask
        className="mb-2"
        isExpanded={isCreateFormOpened}
        $$taskManager={$$taskCreator}
        dateModifier
        closeTaskForm={onCloseCreateForm}
      />
      {isDisclosed &&
        tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <EditableTask
              key={task.id}
              task={task}
              formDateModifier
              $$taskUpdater={$$taskUpdater}
              $$taskRemover={$$taskTrasher}
              onSelect={() => {}}
              onBlur={() => {}}
              ref={null}
            />
          )
        })}
    </>
  )
}

const CompletedTasks = ({ tasks }: { tasks: Task[] }) => {
  const [isDisclosed, disclose] = useState(true)
  const onCreateTask = useUnit($$taskCreator.createTaskTriggered)
  const initFields = useUnit($$taskCreator.setFieldsTriggered)
  const params = useUnit(routes.project.$params)
  const {
    isOpened: isCreateFormOpened,
    open: onOpenCreateForm,
    close: onCloseCreateForm,
  } = useDisclosure({
    id: ModalName.CreateTaskForm,
    onClose: onCreateTask,
    onOpen: () => {
      initFields({
        project_id: params.projectId,
        type: TaskType.UNPLACED,
        status: TaskStatus.FINISHED,
      })
    },
  })

  return (
    <>
      <Header
        isDisclosed={isDisclosed}
        disclose={disclose}
        title="Completed Tasks"
        onOpenCreateForm={onOpenCreateForm}
        color="purple"
        display={!!tasks.length}
      />
      <ExpandedTask
        className="mb-2"
        isExpanded={isCreateFormOpened}
        $$taskManager={$$taskCreator}
        dateModifier
        closeTaskForm={onCloseCreateForm}
      />
      {isDisclosed &&
        tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <EditableTask
              key={task.id}
              // ref={(node) => addNode(node!, index)}
              task={task}
              $$taskUpdater={$$taskUpdater}
              formDateModifier
              $$taskRemover={$$taskTrasher}
              onSelect={() => {}}
              onBlur={() => {}}
              ref={null}
            />
          )
        })}
    </>
  )
}

const Header = ({
  title,
  onOpenCreateForm,
  color,
  isDisclosed,
  disclose,
  display = true,
}: {
  title: string
  onOpenCreateForm: () => void
  color?: string
  isDisclosed: boolean
  disclose: (d: boolean) => void
  display: boolean
}) => {
  return (
    <div className="mb-3 flex gap-x-2">
      <Button
        intent="base"
        className="w-3"
        onClick={() => disclose(!isDisclosed)}
      >
        {display && (
          <Icon
            name="common/arrow"
            className={`text-[12px] ${
              isDisclosed ? "rotate-180" : "rotate-90"
            }`}
          />
        )}
      </Button>
      <div
        style={{ background: `var(--color-${color})` }}
        className="rounded-md p-1 text-xs uppercase"
      >
        {title}
      </div>
      <Button
        onClick={onOpenCreateForm}
        intent="primary"
        className="flex items-center px-2 text-xs"
      >
        <Icon name="common/plus" className="mr-1" />
        Add Task
      </Button>
    </div>
  )
}
