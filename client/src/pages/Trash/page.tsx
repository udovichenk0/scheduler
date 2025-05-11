import { t } from "i18next"
import { useList, useUnit } from "effector-react"
import { useState } from "react"

import { Layout } from "@/widgets/layout/main/ui.tsx"

import { TaskItem } from "@/entities/task/ui/item.tsx"

import { useDocumentTitle } from "@/shared/lib/react/use-document.title.ts"
import { NoTasks } from "@/shared/ui/no-tasks"
import { Button } from "@/shared/ui/buttons/main-button"
import { useSelectItem } from "@/shared/lib/use-select-item"

import { $$deleteTask, $trashTasks } from "./model"

const Trash = () => {
  useDocumentTitle(t("task.trash"))

  const tasks = useUnit($trashTasks)
  const onDeleteTask = useUnit($$deleteTask.taskDeletedById)
  const onDeleteAllTasks = useUnit($$deleteTask.allTasksDeleted)
  const list = useList($trashTasks, (task, id) => {
    return (
      <div className="px-3 pb-2" key={task.id}>
        <TaskItem
          ref={(node) => addNode(node!, id)}
          isShown
          typeLabel
          dateLabel
          onSelect={() => onSelect(id)}
          onBlur={onUnselect}
          task={task}
        />
      </div>
    )
  })
  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<string>>(null)
  const { onSelect, onUnselect, addNode } = useSelectItem({
    items: tasks,
    onChange: (task) => setSelectedTaskId(task?.id || null),
  })

  return (
    <Layout>
      <Layout.Header
        slot={
          <Button
            onClick={onDeleteAllTasks}
            intent={"accent"}
            size={"xs"}
            className="flex items-center gap-x-2"
          >
            <Cross />
            {t("action.clearBucket")}
          </Button>
        }
        iconName="common/inbox"
        title={t("task.trash")}
      />
      <Layout.Content className="flex flex-col">
        {list}
        <NoTasks isTaskListEmpty={!tasks?.length} />
      </Layout.Content>

      <Layout.Footer
        isTrashDisabled={!selectedTaskId}
        onDeleteTask={() => selectedTaskId && onDeleteTask(selectedTaskId)}
      />
    </Layout>
  )
}
const Cross = () => {
  return (
    <div
      className="before:bg-accent after:bg-accent relative mt-[2px]
      h-[10px] w-[10px] before:absolute before:bottom-0 before:left-1/2 before:h-3 before:w-[2px] before:-rotate-45
      before:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-3 after:w-[2px] after:rotate-45 after:content-['']
    "
    ></div>
  )
}
export default Trash
