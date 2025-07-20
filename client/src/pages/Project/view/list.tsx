import { useStoreMap, useUnit } from "effector-react"
import { Store } from "effector"

import { EditableTask } from "@/widgets/editable-task"
import { ExpandedTask } from "@/widgets/expanded-task"

import { Task } from "@/entities/task/type"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
// import { TaskStatus } from "@/shared/api/scheduler.schemas"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { routes } from "@/shared/routing/router"

import { $$taskCreator, $$taskTrasher, $$taskUpdater } from "../model"

export const List = ({ $tasks }: { $tasks: Store<Nullable<Task[]>> }) => {
  // const inprogressTasks = useStoreMap({
  //   store: $tasks,
  //   keys: [],
  //   fn: (tasks) => {
  //     if (!tasks) return []
  //     return tasks.filter((tasks) => tasks.status === TaskStatus.inprogress)
  //   },
  // })

  const completedTasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => {
      if (!tasks) return []
      return tasks
      // return tasks.filter((tasks) => tasks.status === TaskStatus.finished)
    },
  })

  return (
    <>
      <CompletedTasks tasks={completedTasks} />
    </>
  )
}

const CompletedTasks = ({ tasks }: { tasks: Task[] }) => {
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
      initFields({ project_id: params.projectId })
    },
  })

  return (
    <>
      <Header
        title="Completed Tasks"
        onOpenCreateForm={onOpenCreateForm}
        color="purple"
      />
      <ExpandedTask
        className="mb-2"
        isExpanded={isCreateFormOpened}
        $$taskManager={$$taskCreator}
        dateModifier={false}
        closeTaskForm={onCloseCreateForm}
      />
      {tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <EditableTask
              key={task.id}
              // ref={(node) => addNode(node!, index)}
              task={task}
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

const Header = ({
  title,
  onOpenCreateForm,
  color,
}: {
  title: string
  onOpenCreateForm: () => void
  color?: string
}) => {
  return (
    <div className="mb-3 flex gap-x-2">
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
