import { SDate } from "@/shared/lib/date/lib"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { DatePickerV2 } from "@/shared/ui/date-picker"
import { Popover } from "@/shared/ui/disclosure/popover"
import { ReactNode } from "react"

type DatePopoverProps = {
  children: ReactNode
  startDate: Nullable<SDate>
  dueDate: Nullable<SDate>
  onChange: (data: {
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }) => void
}

export const DatePopover = ({
  children,
  startDate,
  dueDate,
  onChange,
}: DatePopoverProps) => {
  const {
    isOpened: isDateOpened,
    open: openDate,
    close: closeDate,
  } = useDisclosure({ prefix: "create-task/date" })

  return (
    <Popover
      label="Select task date"
      isOpened={isDateOpened}
      closeModal={closeDate}
    >
      <Popover.Trigger asChild onClick={openDate}>
        {children}
      </Popover.Trigger>
      <Popover.Content className="p-0! mt-2">
        <DatePickerV2
          startDate={startDate}
          dueDate={dueDate}
          onCancel={closeDate}
          onDateChange={({ start, due }) => {
            onChange({ startDate: start, dueDate: due })
            closeDate()
          }}
        />
      </Popover.Content>
    </Popover>
  )
}
