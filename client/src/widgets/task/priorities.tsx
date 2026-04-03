import { getPriorityColor, getPriorityLabel } from "@/entities/task/lib"
import { TaskPriority } from "@/entities/task/model/task.model"
import { Priority as PriorityType } from "@/entities/task/type"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { useState } from "react"

export const Priority = ({ priority }: { priority: PriorityType }) => {
  const color = `var(--color-${getPriorityColor(priority)})`
  const label = getPriorityLabel(priority)

  return (
    <>
      <Icon
        name="common/flag"
        style={{
          color,
          fill: priority == TaskPriority.NONE ? "none" : color,
        }}
        className="fill-none"
      />
      {label && <div>{label}</div>}
    </>
  )
}

export const Priorities = ({
  priority,
  onUpdate,
}: {
  priority: PriorityType
  onUpdate: (priority: PriorityType) => void
}) => {
  const [priorities] = useState([
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
          style={{
            color: `var(--color-${getPriorityColor(TaskPriority.HIGH)})`,
          }}
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
          style={{
            color: `var(--color-${getPriorityColor(TaskPriority.LOW)})`,
          }}
        />
      ),
    },
    {
      label: "Clear",
      value: TaskPriority.NONE,
      icon: <Icon name="common/cancel" className="text-cFont" />,
    },
  ])
  return (
    <div>
      <div className="text-cOpacitySecondFont mb-2 px-2 pt-1 text-xs">
        Task Priority
      </div>
      <div className="flex flex-col">
        {priorities.map(({ value, label, icon }) => {
          return (
            <Button
              size="sm"
              key={value}
              onClick={() => {
                onUpdate(value)
                close()
              }}
              className="text-left"
            >
              <span className="flex-1">
                <span className="mr-2">{icon}</span>
                {label}
              </span>
              {value === priority && (
                <span className="float-end">
                  <Icon name="common/done" className="text-accent w-2.5" />
                </span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
