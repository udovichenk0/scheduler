import { useRef, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main/ui.tsx"
import { ExpandedTask } from "@/widgets/expanded-task"

import { CloseButton, Modal } from "@/shared/ui/modal"
import { useDocumentTitle } from "@/shared/lib/react/use-document.title.ts"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { Button } from "@/shared/ui/buttons/main-button"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { Icon } from "@/shared/ui/icon"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"

import { Calendar } from "./ui/calendar-table"
import {
  $$createTask,
  $$trashTask,
  $$updateTask,
  $mappedTasks,
  $moreTasks,
  setMoreTasks,
} from "./model"
import { MoreTasks } from "./ui/more-tasks"

const CalendarPage = () => {
  const [headerDate, setHeaderDate] = useState(dayjs)
  const { t } = useTranslation()
  const taskRef = useRef<HTMLButtonElement>(null)
  const cellRef = useRef<HTMLButtonElement>(null)
  useDocumentTitle(t("task.calendar"))

  const mappedTasks = useUnit($mappedTasks)
  const onSetMoreTasks = useUnit(setMoreTasks)

  const onSetTaskDate = useUnit($$createTask.setDate)
  const onResetCreateTaskForm = useUnit($$createTask.resetFieldsTriggered)
  const onCreateTask = useUnit($$createTask.createTaskTriggered)

  const updateTaskId = useUnit($$updateTask.$id)
  const onUpdateStatus = useUnit($$updateTask.statusChangedAndUpdated)
  const onUpdateTask = useUnit($$updateTask.updateTaskTriggered)
  const onInitFields = useUnit($$updateTask.init)
  const onResetUpdateTaskForm = useUnit($$updateTask.resetFieldsTriggered)

  const {
    isOpened: isUpdateTaskOpened,
    open: onOpenUpdateTaskForm,
    close: onCloseUpdateTaskForm,
    cancel: onCancelUpdateTaskForm,
  } = useDisclosure({ id: ModalName.UpdateTaskForm, onClose: onUpdateTask })
  const {
    isOpened: isCreateTaskFormOpened,
    open: onOpenCreateTaskForm,
    close: onCloseCreateTaskForm,
    cancel: onCancelCreateTaskForm,
  } = useDisclosure({ id: ModalName.CreateTaskForm, onClose: onCreateTask })

  const {
    isOpened: isMoreTasksModalOpened,
    open: onOpenMoreTasksModal,
    close: onCloseMoreTasksModal,
  } = useDisclosure({ id: ModalName.MoreTasksModal })

  return (
    <Layout>
      <Layout.Header
        iconName="common/calendar"
        title={<Title date={headerDate} />}
      />
      <Layout.Content className="flex h-full flex-col">
        <Modal
          isOpened={isUpdateTaskOpened}
          label="Update task"
          closeModal={onCloseUpdateTaskForm}
          focusAfterClose={taskRef}
        >
          <Modal.Content className="p-0! w-[600px]">
            <ExpandedTask
              modifyTaskModel={$$updateTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={
                <UpdateActionsButtons
                  onSave={onCloseUpdateTaskForm}
                  onCancel={() => {
                    onCancelUpdateTaskForm()
                    onResetUpdateTaskForm()
                  }}
                  taskId={updateTaskId!}
                />
              }
            />
          </Modal.Content>
        </Modal>
        <Modal
          focusAfterClose={cellRef}
          label="Create task"
          isOpened={isCreateTaskFormOpened}
          closeModal={onCloseCreateTaskForm}
        >
          <Modal.Content className="contents w-[600px]">
            <ExpandedTask
              modifyTaskModel={$$createTask}
              dateModifier={true}
              sideDatePicker={false}
              rightPanelSlot={
                <ActionsButton
                  onSave={onCloseCreateTaskForm}
                  onCancel={() => {
                    onCancelCreateTaskForm()
                    onResetCreateTaskForm()
                  }}
                />
              }
            />
          </Modal.Content>
        </Modal>
        <Modal
          label="More tasks"
          isOpened={isMoreTasksModalOpened}
          closeModal={onCloseMoreTasksModal}
        >
          <Modal.Header>
            <span className="text-cFont w-full pl-6 text-center text-[12px]">
              All tasks
            </span>
            <CloseButton close={onCloseMoreTasksModal} />
          </Modal.Header>
          <Modal.Content className="flex w-[350px] flex-col gap-y-1 overflow-auto px-3">
            <MoreTasks
              $tasks={$moreTasks}
              onTaskClick={(target, task) => {
                onOpenUpdateTaskForm()
                onInitFields(task)
                taskRef.current = target
              }}
              onUpdateStatus={onUpdateStatus}
            />
          </Modal.Content>
        </Modal>
        <Calendar
          onTaskClick={(target, task) => {
            onOpenUpdateTaskForm()
            onInitFields(task)
            taskRef.current = target
          }}
          onCellClick={(target, date) => {
            cellRef.current = target
            onOpenCreateTaskForm()
            onSetTaskDate(date)
          }}
          onShowMoreTasks={(tasks) => {
            onSetMoreTasks(tasks)
            onOpenMoreTasksModal()
          }}
          date={headerDate}
          setDate={setHeaderDate}
          tasks={mappedTasks}
          onUpdateStatus={onUpdateStatus}
        />
        <div tabIndex={0}></div>
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

export default CalendarPage

const UpdateActionsButtons = ({
  taskId,
  onSave,
  onCancel,
}: {
  taskId: TaskId
  onSave: () => void
  onCancel: () => void
}) => {
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
          className="text-cIconDefault text-[24px]"
        />
      </Button>
      <ActionsButton onSave={onSave} onCancel={onCancel} />
    </div>
  )
}
const ActionsButton = ({
  onSave,
  onCancel,
}: {
  onSave: () => void
  onCancel: () => void
}) => {
  return (
    <div className="space-x-2 text-white">
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
