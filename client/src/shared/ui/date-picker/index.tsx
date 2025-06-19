import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"
import { SDate } from "@/shared/lib/date/lib"

import { Modal } from "../modal"
import { Button } from "../buttons/main-button"
import { Icon } from "../icon"

import { Calendar } from "./ui/calendar"
import { DateInput } from "./ui/input"
import { DateShortcutPicker } from "./ui/date-shortcut-picker"

const DateAction = {
  Start: "change-start",
  End: "change-end",
} as const

type ChangeDateTypeAction = (typeof DateAction)[keyof typeof DateAction]

export function DatePicker({
  startDate,
  dueDate,
  CustomInput,
  onDateChange,
}: {
  startDate: Nullable<SDate>
  dueDate: Nullable<SDate>
  CustomInput?: ({ onClick }: { onClick: () => void }) => ReactNode
  onDateChange: (data: {
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }) => void
}) {
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempDueDate, setTempDueDate] = useState(dueDate)
  const dueDateInput = useRef<HTMLInputElement>(null)
  const [dateAction, setDateAction] = useState<ChangeDateTypeAction>(
    DateAction.Start,
  )
  const {
    isOpened: isDateModalOpened,
    open: onOpenDateModal,
    close: onCloseDateModal,
    cancel: onCancelDateModal,
  } = useDisclosure({
    prefix: ModalName.DateModal,
    onClose: () => {
      onDateChange({ startDate: tempStartDate, dueDate: tempDueDate })
    },
  })

  const onCancel = () => {
    onCancelDateModal()
    setTempDueDate(dueDate)
    setTempStartDate(startDate)
  }

  useEffect(() => {
    setTempDueDate(dueDate)
    setTempStartDate(startDate)
  }, [startDate, dueDate])

  const onSetDate = useCallback(
    (date: SDate) => {
      const dueDateBeforeStart =
        tempStartDate &&
        dateAction == DateAction.End &&
        date.isBefore(tempStartDate)
      const startDateAfterDue =
        tempDueDate &&
        dateAction == DateAction.Start &&
        date.isAfter(tempDueDate)

      if (dateAction == DateAction.Start) {
        setTempStartDate(date)
        setDateAction(DateAction.End)
        if (startDateAfterDue) {
          setTempDueDate(null)
        }
        dueDateInput.current?.focus()
      } else {
        setTempDueDate(date)
        if (dueDateBeforeStart) {
          setTempStartDate(null)
        }
      }
    },
    [tempStartDate, tempDueDate, dateAction],
  )

  const onCellClick = (date: SDate) => {
    const sdh = tempStartDate?.hour || 0
    const sdm = tempStartDate?.minute || 0

    const ddh = tempDueDate?.hour || 0
    const ddm = tempDueDate?.minute || 0

    const newStartDate = date.setHour(sdh).setMinute(sdm)
    const newDueDate = date.setHour(ddh).setMinute(ddm)
    const newDate = dateAction === DateAction.Start ? newStartDate : newDueDate

    onSetDate(newDate)
  }

  return (
    <Modal
      label="Select task date"
      isOpened={isDateModalOpened}
      closeModal={onCloseDateModal}
    >
      {CustomInput ? (
        <CustomInput onClick={onOpenDateModal} />
      ) : (
        <div>
          <Button
            onClick={onOpenDateModal}
            size={"sm"}
            intent={"primary"}
            className="flex"
          >
            <Icon
              name={"common/upcoming"}
              className="text-cTaskEditDefault mr-4 size-[18px]"
            />
          </Button>
        </div>
      )}
      <Modal.Content className="p-0! w-[540px]">
        <div>
          <div className="border-b-1 border-b-cBorder flex gap-x-2 p-2">
            <DateInput
              className="py-1"
              onSelectDate={onSetDate}
              value={tempStartDate}
              onClick={() => setDateAction(DateAction.Start)}
              placeholder="Start Date"
              icon={
                <Icon
                  name="common/calendar-start-date"
                  className="text-cSecondBorder"
                />
              }
            />
            <DateInput
              className="py-1"
              onSelectDate={onSetDate}
              value={tempDueDate}
              onClick={() => setDateAction(DateAction.End)}
              placeholder="Due Date"
              ref={dueDateInput}
              icon={
                <Icon
                  name="common/calendar-due-date"
                  className="text-cSecondBorder"
                />
              }
            />
          </div>
          <div className="grid grid-cols-2">
            <DateShortcutPicker onSetDate={onSetDate} />
            <Calendar
              onChange={onCellClick}
              tempDueDate={tempDueDate}
              tempStartDate={tempStartDate}
              onCancel={onCancel}
              onClose={onCloseDateModal}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}
