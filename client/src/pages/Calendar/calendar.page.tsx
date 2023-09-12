import { useState } from "react"
import dayjs from "dayjs"
import { useUnit } from "effector-react"

import { Layout } from "@/templates/main"

import { ExpandedTask } from "@/widgets/expanded-task"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"
import { TaskId } from "@/shared/api/task"

import {
  $$createTask,
  $$deleteTask,
  $$modal,
  $$moreTasksModal,
  $$updateTask,
  $createdTask,
  $mappedTasks,
  $updatedTask,
  canceled,
  createTaskModalOpened,
  saved,
  updateTaskModalOpened,
} from "./calendar.model"
import { Calendar } from "./ui/calendar-table"

export const CalendarPage = () => {
  const [date, setDate] = useState(dayjs())
  const [tasks, openCreatedTask, openUpdatedTask, updatedTaskId, createdTask] =
    useUnit([
      $mappedTasks,
      createTaskModalOpened,
      updateTaskModalOpened,
      $updatedTask,
      $createdTask,
    ])
  const displayedMonth = date.month()
  const displayedYear = date.year()
  return (
    <Layout>
      <Layout.Header
        iconName="common/calendar"
        title={`Calendar, ${[displayedMonth]} ${displayedYear}`}
      />
      <Layout.Content className="flex h-full flex-col">
        <Calendar
          openUpdatedTask={openUpdatedTask}
          openCreatedTask={openCreatedTask}
          modal={$$moreTasksModal}
          date={date}
          setDate={setDate}
          tasks={tasks}
        />
        <BaseModal className="w-[600px]" modal={$$modal}>
          {updatedTaskId && (
            <ExpandedTask
              modifyTaskModel={$$updateTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={<UpdateActionsButtons taskId={updatedTaskId} />}
            />
          )}
          {createdTask && (
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={<ActionsButton />}
            />
          )}
        </BaseModal>
      </Layout.Content>
    </Layout>
  )
}

const UpdateActionsButtons = ({ taskId }: { taskId: TaskId }) => {
  const deleteTaskById = useUnit($$deleteTask.taskDeletedById)
  return (
    <div className="flex items-center">
      <Button
        onClick={() => deleteTaskById(taskId)}
        size={"xs"}
        className="mr-2"
        intent={"primary"}
      >
        <Icon
          name="common/trash-can"
          className="text-[24px] text-cIconDefault"
        />
      </Button>
      <ActionsButton />
    </div>
  )
}
const ActionsButton = () => {
  const [onCancel, onSave] = useUnit([canceled, saved])
  return (
    <div className="space-x-2">
      <Button onClick={onCancel} className="w-24 text-[12px]">
        Cancel
      </Button>
      <Button
        onClick={onSave}
        intent={"filled"}
        className="w-24 p-[1px] text-[12px]"
      >
        Save
      </Button>
    </div>
  )
}
