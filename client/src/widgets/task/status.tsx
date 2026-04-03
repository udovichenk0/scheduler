import { getIconNameByStatus, getStatusColor } from "@/entities/task/lib"
import { TaskStatus } from "@/entities/task/model/task.model"
import { Status as StatusType } from "@/entities/task/type"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Popover } from "@/shared/ui/disclosure/popover"
import { ReactNode, useState } from "react"
export const StatusPopover = ({
  onChange,
  children,
}: {
  onChange: (status: StatusType) => void
  children: ReactNode
}) => {
  const [statuses] = useState([
    {
      value: TaskStatus.TODO,
      label: "TO DO",
      color: `var(--color-${getStatusColor(TaskStatus.TODO)})`,
    },
    {
      value: TaskStatus.INPROGRESS,
      label: "IN PROGRESS",
      color: `var(--color-${getStatusColor(TaskStatus.INPROGRESS)})`,
    },
    {
      value: TaskStatus.FINISHED,
      label: "FINISHED",
      color: `var(--color-${getStatusColor(TaskStatus.FINISHED)})`,
    },
  ])
  const { isOpened, open, close } = useDisclosure({
    prefix: ModalName.StatusPopover,
  })

  return (
    <Popover isOpened={isOpened} label="Select task status" closeModal={close}>
      <Popover.Trigger asChild onClick={open}>
        {children}
      </Popover.Trigger>
      <Popover.Content className="mt-2">
        <div className="text-cOpacitySecondFont mb-2 px-2 pt-1 text-xs">
          Task Status
        </div>
        <div className="flex flex-col">
          {statuses.map(({ label, value, color }) => {
            return (
              <Button
                size="sm"
                key={value}
                onClick={() => {
                  onChange(value)
                  close()
                }}
                className="text-left"
              >
                <span>
                  <Icon
                    style={{ color }}
                    className="mr-2"
                    name={getIconNameByStatus(value)}
                  />
                  {label}
                </span>
              </Button>
            )
          })}
        </div>
      </Popover.Content>
    </Popover>
  )
}

export const StatusIcon = ({ status }: { status: StatusType }) => {
  return (
    <Icon
      style={{ color: `var(--color-${getStatusColor(status)})` }}
      name={getIconNameByStatus(status)}
    />
  )
}
