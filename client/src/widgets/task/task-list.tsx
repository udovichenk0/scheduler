import { Task } from "@/entities/task/type"
import { Store } from "effector"
import { useList, useStoreMap } from "effector-react"
import { TaskListItem } from "./"
import { TaskUpdater } from "@/features/manage-task/update"
import { CreateTaskListItem } from "./create-task-row"
import { TaskCreator } from "@/features/manage-task/create"
import { useEffect, useRef } from "react"
import { getGlobalCssVariable } from "@/shared/lib/get-global-css-variable"
import { default_scroll_width } from "@/shared/config/constants"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { ListId } from "@/entities/project/list/type"
import { TaskTrasher } from "@/features/manage-task/trash"

const Header = ({ $tasks }: { $tasks: Store<Task[]> }) => {
  const taskCount = useStoreMap({
    store: $tasks,
    keys: [],
    fn: (tasks) => tasks.length,
  })

  return (
    <div
      className={
        "border-b-cBorder *:text-cOpacitySecondFont flex h-9 w-full items-center gap-x-1 border-b text-xs *:h-full"
      }
    >
      <Button className="min-w-75 from-main via-main/80 to-main/10 bg-linear-to-r sticky left-0 w-full rounded-none px-4 text-start">
        {taskCount} Tasks
      </Button>
      <Button className="min-w-45 items-center rounded-none px-4 text-start">
        Due date
      </Button>
      <Button className="min-w-45 items-center rounded-none px-4 text-start">
        Priority
      </Button>
      <Button className="min-w-45 items-center rounded-none px-4 text-start">
        Date created
      </Button>
      <div className="flex items-center px-4">
        <Button size="sxs">
          <Icon className="text-red" name="common/trash-can" />
        </Button>
      </div>
    </div>
  )
}

export const TaskList = ({
  $tasks,
  $$taskUpdater,
  $$taskTrasher,
  $$taskCreator,
  listId,
}: {
  $tasks: Store<Task[]>
  $$taskUpdater: TaskUpdater
  $$taskTrasher: TaskTrasher
  $$taskCreator: TaskCreator
  listId: ListId
}) => {
  const scrolled = useRef(false)
  const isCreatingTask = useRef(false)
  const ref = useRef<HTMLDivElement>(null)
  const list = useList($tasks, (task) => {
    return (
      <TaskListItem
        $$taskUpdater={$$taskUpdater}
        $$taskTrasher={$$taskTrasher}
        task={task}
        key={task.id}
      />
    )
  })
  useEffect(() => {
    const r = ref.current
    if (!r) return
    const clickedOnScroll = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      const isScrollable = element.scrollWidth > element.offsetWidth
      if (!isScrollable) return
      const scrollWidth =
        parseFloat(getGlobalCssVariable("scroll-bar-width")) ||
        default_scroll_width
      if (!scrollWidth) return
      const parentTop = element.getBoundingClientRect().top
      const clickY = e.clientY - parentTop
      const isOnScroll = clickY + scrollWidth > element.clientHeight
      if (isOnScroll && isCreatingTask.current) {
        scrolled.current = true
      }
    }
    r.addEventListener("mousedown", clickedOnScroll)
    return () => {
      r.removeEventListener("mousedown", clickedOnScroll)
    }
  }, [])
  return (
    <div className="overflow-y-scroll">
      <div ref={ref} className="mb-2 overflow-x-auto">
        <div className="inline-block min-w-full pb-2">
          <Header $tasks={$tasks} />

          {list}
          <CreateTaskListItem
            listId={listId}
            clickedOnScroll={scrolled}
            onCreateTaskToggle={(b) => {
              isCreatingTask.current = b
            }}
            $$taskCreator={$$taskCreator}
          />
        </div>
      </div>
    </div>
  )
}
