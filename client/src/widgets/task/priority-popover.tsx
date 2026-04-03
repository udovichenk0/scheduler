import { Priority } from "@/entities/task/type"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Popover } from "@/shared/ui/disclosure/popover"
import { Priorities } from "./priorities"
import { ReactNode } from "react"

export const PriorityPopover = ({
  priority,
  children,
  onUpdate,
}: {
  priority: Priority
  children: ReactNode
  onUpdate: (priority: Priority) => void
}) => {
  const { isOpened, open, close } = useDisclosure({
    prefix: ModalName.PriorityPicker,
  })

  return (
    <Popover
      isOpened={isOpened}
      label="Select task priority"
      closeModal={close}
    >
      <Popover.Trigger asChild onClick={open}>
        {children}
      </Popover.Trigger>
      <Popover.Content className="w-50! mt-2">
        <Priorities
          onUpdate={(priority) => {
            onUpdate(priority)
            close()
          }}
          priority={priority}
        />
      </Popover.Content>
    </Popover>
  )
}
