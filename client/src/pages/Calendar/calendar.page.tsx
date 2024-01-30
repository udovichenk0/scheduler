import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { ExpandedTask } from "@/widgets/expanded-task"
import { Layout } from "@/widgets/layout/main"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { TaskId } from "@/shared/api/task"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { useDocumentTitle } from "@/shared/lib/react"

import {
  $$createTask,
  $$trashTask,
  $$moreTasksModal,
  $$updateTask,
  $createdTask,
  $isTaskFormModalOpened,
  $mappedTasks,
  $updatedTask,
  canceled,
  createTaskModalOpened,
  saved,
  updateTaskModalOpened,
} from "./calendar.model"
import { Calendar } from "./ui/calendar-table"
import { TaskFormModal } from "./ui/form-modal"

const CalendarPage = () => {
  const [date, setDate] = useState(dayjs)
  const { t } = useTranslation()
  useDocumentTitle(t("task.calendar"))

  const mappedTasks = useUnit($mappedTasks)
  const openCreatedTask = useUnit(createTaskModalOpened)
  const openUpdatedTask = useUnit(updateTaskModalOpened)
  const updatedTaskId = useUnit($updatedTask)
  const createdTask = useUnit($createdTask)

  return (
    <Layout>
      <Layout.Header iconName="common/calendar" title={<Title date={date} />} />
      <Layout.Content className="flex h-full flex-col">
        <Calendar
          openUpdatedTask={openUpdatedTask}
          openCreatedTask={openCreatedTask}
          modal={$$moreTasksModal}
          date={date}
          setDate={setDate}
          tasks={mappedTasks}
        />
        <TaskFormModal
          className="w-[600px]"
          $isOpened={$isTaskFormModalOpened}
          onClose={saved}
        >
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
        </TaskFormModal>
      </Layout.Content>
    </Layout>
  )
}
const Title = ({ date }: { date: Dayjs }) => {
  const { t } = useTranslation()
  const displayedMonth = date.month()
  const displayedYear = date.year()

  return (
    <span>
      {t("task.calendar")},&nbsp;
      {t(LONG_MONTHS_NAMES[displayedMonth])}&nbsp;
      {displayedYear}
    </span>
  )
}
const UpdateActionsButtons = ({ taskId }: { taskId: TaskId }) => {
  const trashTaskById = useUnit($$trashTask.taskTrashedById)
  return (
    <div className="flex items-center">
      <Button
        onClick={() => trashTaskById(taskId)}
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
  const onCancel = useUnit(canceled)
  const onSave = useUnit(saved)

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

export default CalendarPage
