import { Task } from "@/entities/task/type";
import { TaskStatus } from "@/shared/api/scheduler.schemas";
import { useStoreMap, useUnit } from "effector-react";
import { $$createTask, $$taskModel, $$updateTask } from "../model";
import { StoreWritable } from "effector";
import { EditableTask } from "@/widgets/editable-task";
import { Button } from "@/shared/ui/buttons/main-button";
import { Icon } from "@/shared/ui/icon";
import { ExpandedTask } from "@/widgets/expanded-task";
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure";
import { ModalName } from "@/shared/lib/disclosure/disclosure-names";
import { router, routes } from "@/shared/routing/router";

export const List = ({$tasks}: {$tasks: StoreWritable<Nullable<Task[]>>}) => {
  const inprogressTasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => {
      if (!tasks) return []
      return tasks.filter((tasks) => tasks.status === TaskStatus.inprogress)
    }
  })

  const completedTasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => {
      console.log("lol",tasks)
      if (!tasks) return []
      return tasks
      // return tasks.filter((tasks) => tasks.status === TaskStatus.finished)
    }
  })

  return (
    <>
      <CompletedTasks tasks={completedTasks}/>
    </>
  )
}

const CompletedTasks = ({tasks}: {tasks: Task[]}) => {
  const onCreateTask = useUnit($$createTask.createTaskTriggered)
  const initFields = useUnit($$createTask.setFieldsTriggered)
  const params = useUnit(routes.project.$params)
  const {
    isOpened: isCreateFormOpened,
    open: onOpenCreateForm,
    close: onCloseCreateForm,
  } = useDisclosure({ 
    id: ModalName.CreateTaskForm, 
    onClose: onCreateTask, 
    onOpen: () => {
      initFields({project_id: params.projectId})
    }
  })

  return (
    <>
      <Header title="Completed Tasks" onOpenCreateForm={onOpenCreateForm} color="purple"/>
        <ExpandedTask
          className="mb-2"
          isExpanded={isCreateFormOpened}
          modifyTaskModel={$$createTask}
          dateModifier={false}
          closeTaskForm={onCloseCreateForm}
        />
      {tasks.length > 0 && (
        tasks.map((task) => {
          return (
            <EditableTask
              key={task.id}
              // ref={(node) => addNode(node!, index)}
              task={task}
              $$updateTask={$$updateTask}
              onSelect={() => { } }
              onBlur={() => { } } 
              ref={null}            
            />
          )
        })
      )}
    </>
  )
}

const Header = ({title, onOpenCreateForm, color}: {title: string, onOpenCreateForm: () => void, color?: string}) => {
  return (
    <div className="flex gap-x-2 mb-3">
      <div style={{ background:`var(--color-${color})`}} className="text-xs uppercase p-1 rounded-md">{title}</div>
      <Button onClick={onOpenCreateForm} intent="primary" className="text-xs px-2 flex items-center">
        <Icon name="common/plus" className="mr-1" />
        Add Task
      </Button>
    </div>
  )
}