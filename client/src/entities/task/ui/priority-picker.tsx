import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { Modal } from "@/shared/ui/modal"
import { Icon } from "@/shared/ui/icon"

import { getPriorityColor } from "../lib"
import { TaskPriority } from "../model/task.model"
import { Priority } from "../type"

const priorities = [
  {
    label: "Urgent",
    value: TaskPriority.URGENT,
    icon: (
      <Icon
        name="common/flag"
        style={{
          color: `var(--color-${getPriorityColor(TaskPriority.URGENT)})`,
        }}
      />
    ),
  },
  {
    label: "High",
    value: TaskPriority.HIGH,
    icon: (
      <Icon
        name="common/flag"
        style={{ color: `var(--color-${getPriorityColor(TaskPriority.HIGH)})` }}
      />
    ),
  },
  {
    label: "Normal",
    value: TaskPriority.NORMAL,
    icon: (
      <Icon
        name="common/flag"
        style={{
          color: `var(--color-${getPriorityColor(TaskPriority.NORMAL)})`,
        }}
      />
    ),
  },
  {
    label: "Low",
    value: TaskPriority.LOW,
    icon: (
      <Icon
        name="common/flag"
        style={{ color: `var(--color-${getPriorityColor(TaskPriority.LOW)})` }}
      />
    ),
  },
  {
    label: "Clear",
    value: TaskPriority.NONE,
    icon: <Icon name="common/cancel" className="text-cFont" />,
  },
]

export const PriorityPicker = ({
  priority,
  onUpdate,
}: {
  priority: Priority
  onUpdate: (priority: Priority) => void
}) => {
  const color = `var(--color-${getPriorityColor(priority)})`
  const { isOpened, open, close } = useDisclosure({
    prefix: ModalName.PriorityPicker,
  })
  return (
    <div className="w-25 relative mr-1 flex justify-start">
      <Modal
        portal={false}
        overlay={false}
        isOpened={isOpened}
        label="Pick a priority"
        closeModal={close}
      >
        <button
          data-active={isOpened}
          onClick={open}
          className="data-[active=false]:hover:border-cSecondBorder/40 data-[active=true]:outline-2! outline-accent! w-full rounded-lg border border-transparent px-2 py-1 text-start"
        >
          <Icon
            name="common/flag"
            style={{ color, fillOpacity: Number(priority != "none") }}
            className="mr-1"
          />
          {priority != TaskPriority.NONE && (
            <span className="text-cFont text-xs capitalize">{priority}</span>
          )}
          {priority == TaskPriority.NONE && (
            <span className="text-cFont/40 text-xs capitalize">{priority}</span>
          )}
        </button>
        <Modal.Content className="w-50 absolute right-0 top-full z-10 mt-2">
          {priorities.map(({ value, label, icon }) => {
            return (
              <button
                key={value}
                onClick={() => {
                  onUpdate(value)
                  close()
                }}
                className="hover:bg-hover w-full items-center rounded-lg p-2 text-start"
              >
                <span>
                  <span className="mr-2">{icon}</span>
                  {label}
                </span>
                {value === priority && (
                  <span className="float-end">
                    <Icon name="common/done" className="text-accent w-2.5" />
                  </span>
                )}
              </button>
            )
          })}
        </Modal.Content>
      </Modal>
    </div>
  )
}
