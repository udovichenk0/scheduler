import dayjs from "dayjs"
import { Ref, useRef } from "react"
import { Link } from "atomic-router-react"
import { t } from "i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { routes } from "@/shared/routing"
import { DatePicker } from "@/shared/ui/date-picker"
import { LONG_MONTHS_NAMES } from "@/shared/config/constants"

import { Task, TaskId, TaskStatus, TaskType } from "../type"
import { TaskStatuses } from "../config"
import { Modal } from "@/shared/ui/modal"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"

export const TaskItem = ({
  ref: elem,
  isShown,
  task,
  onUpdateStatus,
  onDoubleClick,
  dateLabel = false,
  onSelect,
  onBlur,
  onUpdateDate,
  typeLabel = false,
}: {
  ref: Ref<HTMLButtonElement>
  isShown: boolean,
  task: Task
  onUpdateDate?: ({ date, id }: { date: Date; id: TaskId }) => void
  onUpdateStatus?: ({ id, status }: { status: TaskStatus; id: TaskId }) => void
  onDoubleClick?: () => void
  dateLabel?: boolean
  onSelect: () => void
  onBlur: (el: Element) => void
  typeLabel?: boolean
}) => {
  const { title, status, start_date } = task

  const {
    isOpened: isDateModalOpened, 
    open: onOpenDateModal, 
    close: onCloseDateModal,
    cancel: onCancelDateModal
  } = useDisclosure({ prefix: ModalName.DateModal })

  const onChangeDate = (date: Date) => {
    onCloseDateModal()
    onUpdateDate?.({ date, id: task.id })
  }
  const isSameDateOrAfter = dayjs(start_date).isSameOrAfter(dayjs())

  if(!isShown){
    return null
  }

  return (
    <div className="group flex">
      <Modal 
        label="Choose date" 
        isOpened={isDateModalOpened} 
        closeModal={onCloseDateModal}>
        <div className="w-5 mr-2">
          {onUpdateDate && (
            <Modal.Trigger 
              className="size-5" 
              intent="base" 
              onClick={() => onOpenDateModal()}
            >
              <Icon
                data-testid="task-date-button"
                name="common/upcoming"
                className="invisible translate-y-1 text-lg text-accent group-hover:visible"
              />
            </Modal.Trigger>
          )}
        </div>
        <Modal.Overlay>
          <Modal.Body>
            <Modal.Content>
              <DatePicker
                currentDate={task.start_date || new Date()}
                onDateChange={onChangeDate}
                onCancel={onCancelDateModal}
                onSave={onCloseDateModal}
              />
            </Modal.Content>
          </Modal.Body>
        </Modal.Overlay>
      </Modal>
      <Button
        aria-label={`Event ${title}`}
        onClick={(e) => {
          if(!e.detail && onDoubleClick){
            onDoubleClick()
          }
          if(e.detail){
            onSelect()
          }
        }}
        onBlur={(e) => {
          const t = e.relatedTarget as Element
          onBlur(t)
        }}
        data-testid="task-item"
        id="task"
        intent={"primary"}
        ref={elem}
        className={`task focus:bg-cFocus flex w-full items-center px-2 text-sm transition-none`}
      >
        <div id="task" className="flex items-center w-full h-full gap-3">
          <Checkbox
            disabled={!onUpdateDate}
            iconClassName="fill-cTaskEditDefault"
            onChange={() => onUpdateStatus?.({ id: task.id, status })}
            checked={status == TaskStatuses.FINISHED}
          />
          <div
            className="w-full h-full py-2"
            onDoubleClick={onDoubleClick}
          >
            <div className="flex">
              {dateLabel && start_date && !dayjs(start_date).isToday() && (
                <span
                  className={`mr-2 rounded-[5px] px-[5px] text-xs ${
                    isSameDateOrAfter
                      ? "bg-cTimeInterval"
                      : "bg-cTimeIntervalLow"
                  }`}
                >
                  {normilizeDate(start_date)}
                </span>
              )}
              <div className="flex items-center">
                {dayjs(start_date).isToday() && (
                  <Icon
                    name="common/filled-star"
                    className="mr-[6px] text-[9px] text-accent"
                  />
                )}
                <h3
                  className={`text-sm font-medium ${
                    status == TaskStatuses.FINISHED && "text-cOpacitySecondFont line-through"
                  }`}
                >
                  {title}
                </h3>
              </div>
            </div>
            <TypeLable isVisible={typeLabel} taskType={task.type}/>
          </div>
        </div>
        {task.description && (
          <Icon name="common/note" className="text-accent" />
        )}
      </Button>
    </div>
  )
}

const TypeLable = ({isVisible, taskType}:{isVisible: boolean, taskType: TaskType}) => {
  const ref = useRef<HTMLDivElement>(null)
  if(!isVisible){
    return null
  }
  return (
    <div ref={ref} className="mt-1 flex items-center gap-2">
      <span className="size-2 rounded-full bg-accent"></span>
      <Link
        onKeyDown={(e) => e.stopPropagation()}
        className="text-xs leading-3 text-cOpacitySecondFont hover:underline"
        to={routes[taskType]}
      >
        {t(`task.${taskType}`)}
      </Link>
    </div>
  )
}

function normilizeDate(date: Date) {
  const dayjsDate = dayjs(date)
  if (dayjsDate.year() == dayjs().year()) {
    return `${t(LONG_MONTHS_NAMES[dayjsDate.month()])} ${dayjsDate.date()}`
  } else {
    return `${dayjsDate.year()} ${t(
      LONG_MONTHS_NAMES[dayjsDate.month()],
    )} ${dayjsDate.date()}`
  }
}


