import { Store } from "effector"
import { useStoreMap, useUnit } from "effector-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { TaskCreator } from "@/features/manage-task/create"
import { TaskUpdater } from "@/features/manage-task/update"

import { TaskType } from "@/entities/task/model/task.model"
import { Task } from "@/entities/task/type"

import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"

import { MonthSwitcher } from "./date-switcher"
import { generateCalendar, processTasks } from "./lib"
import { Cell } from "./cell"
import { TaskTrasher } from "@/features/manage-task/trash"

export const CalendarWidget = ({
  $tasks,
  $$taskUpdater,
  $$taskCreator,
  $$taskTrasher: $$taskRemover,
  onChange,
}: {
  $tasks: Store<Task[]>
  $$taskUpdater: TaskUpdater
  $$taskCreator: TaskCreator
  $$taskTrasher: TaskTrasher
  projectId?: Nullable<string>
  onChange?: (date: SDate) => void
}) => {
  const [calendarDates, setCalendarDates] = useState(() => generateCalendar())
  const [month, setMonth] = useState(() => sdate())

  const changeMonth = (date: SDate) => {
    setMonth(date)
    setCalendarDates(generateCalendar(date.year, date.month))
    onChange?.(date)
  }

  const onCreateTask = useUnit($$taskCreator.createTaskTriggered)
  const onInitCreateFormFields = useUnit($$taskCreator.setFieldsTriggered)
  const onResetCreateTaskForm = useUnit($$taskCreator.resetFieldsTriggered)

  const onUpdateTask = useUnit($$taskUpdater.updateTaskTriggered)
  const onInitUpdateFormFields = useUnit($$taskUpdater.init)
  const onResetUpdateTaskForm = useUnit($$taskUpdater.resetFieldsTriggered)

  const {
    isOpened: isUpdateTaskOpened,
    open: onOpenUpdateTaskForm,
    close: onCloseUpdateTaskForm,
    cancel: onCancelUpdateTaskForm,
  } = useDisclosure({
    id: ModalName.UpdateTaskForm,
    onClose: onUpdateTask,
    onCancel: onResetUpdateTaskForm,
  })

  const {
    isOpened: isCreateTaskFormOpened,
    close: onCloseCreateTaskForm,
    open: onOpenCreateTaskForm,
    cancel: onCancelCreateTaskForm,
  } = useDisclosure({
    id: ModalName.CreateTaskForm,
    onCancel: onResetCreateTaskForm,
    onClose: onCreateTask,
  })
  const tasks = useStoreMap({
    store: $tasks,
    keys: [],
    fn: processTasks,
  })

  return (
    <div>
      {/*<Dialog
        label="Create task"
        isOpened={isCreateTaskFormOpened}
        closeDialog={onCloseCreateTaskForm}
      >
        <Dialog.Content className="p-0! w-[600px]">
          <ExpandedTask
            $$taskManager={$$taskCreator}
            dateModifier={true}
            sideDatePicker={false}
            rightPanelSlot={
              <ActionsButton
                onSave={onCloseCreateTaskForm}
                onCancel={onCancelCreateTaskForm}
              />
            }
          />
        </Dialog.Content>
      </Dialog>*/}
      {/*<Dialog
        label="Update task"
        isOpened={isUpdateTaskOpened}
        closeDialog={onCloseUpdateTaskForm}
      >
        <Dialog.Content className="p-0! w-[600px]">
          <ExpandedTask
            $$taskManager={$$taskUpdater}
            dateModifier={true}
            sideDatePicker={false}
            rightPanelSlot={
              <ActionsButton
                onSave={onCloseUpdateTaskForm}
                onCancel={onCancelUpdateTaskForm}
              />
            }
          />
        </Dialog.Content>
      </Dialog>*/}
      <MonthSwitcher changeMonth={changeMonth} date={month} />
      <CalendarHeader />
      <div>
        {calendarDates.map((week, i) => {
          return (
            <div key={i} className="flex">
              {week.map((date) => {
                const cell = tasks.get(date.toUnix())
                return (
                  <Cell
                    cell={cell}
                    date={date}
                    $$taskRemover={$$taskRemover}
                    onUpdate={(task) => {
                      onInitUpdateFormFields(task)
                      onOpenUpdateTaskForm()
                    }}
                    onCreate={() => {
                      onInitCreateFormFields({
                        start_date: date,
                        type: TaskType.UNPLACED,
                        // project_id: projectId, !FIX
                      })
                      onOpenCreateTaskForm()
                    }}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CalendarHeader = () => {
  const { t } = useTranslation()
  return (
    <div className="border-cBorder text-primary flex justify-around border-y border-r font-bold">
      {SHORT_WEEKS_NAMES.map((week) => {
        return <span key={week}>{t(week)}</span>
      })}
    </div>
  )
}
