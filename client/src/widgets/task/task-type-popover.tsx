import { ReactNode, useMemo } from "react"

import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Popover } from "@/shared/ui/disclosure/popover"
import { Button } from "@/shared/ui/buttons/main-button"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"

type TaskTypeOption = {
  label: string
  value: string
}

const defaultOptions: TaskTypeOption[] = [
  { label: "Task", value: "Task" },
  { label: "Milestone", value: "Milestone" },
  { label: "Form Response", value: "Form Response" },
]

export const TaskTypePopover = ({
  onChange,
  options,
  children,
}: {
  onChange: (value: string) => void
  options?: TaskTypeOption[]
  children: ReactNode
}) => {
  const typeOptions = useMemo(() => options ?? defaultOptions, [options])
  const { isOpened, open, close } = useDisclosure({
    prefix: ModalName.TypeModal,
  })

  const toggle = () => {
    if (isOpened) {
      close()
      return
    }
    open()
  }

  return (
    <Popover isOpened={isOpened} label="Select task type" closeModal={close}>
      <Popover.Trigger asChild onClick={toggle}>
        {children}
      </Popover.Trigger>
      <Popover.Content className={"mt-2 w-52"}>
        <div className="text-cOpacitySecondFont mb-2 px-2 pt-1 text-xs">
          Task type
        </div>
        <div className="flex flex-col">
          {typeOptions.map((option) => (
            <Button
              size="sm"
              key={option.value}
              onClick={() => {
                onChange(option.value)
                close()
              }}
              className="text-left"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}
