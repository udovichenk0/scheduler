import clsx from "clsx"
import { useUnit } from "effector-react"
import { ReactNode, useRef } from "react"

import { TaskRemover } from "@/features/manage-task/interface"

import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import {
  Disclosure,
  useDisclosure,
} from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Modal } from "@/shared/ui/modal"

type TaskContextModalProps = {
  children: ReactNode
  $$taskRemover: TaskRemover
  taskId: string
}
export const TaskContextMenu = ({
  children,
  $$taskRemover,
  taskId,
}: TaskContextModalProps) => {
  const contextMenu = useDisclosure({ prefix: ModalName.TaskContextMenu })
  const { close } = contextMenu

  const onRemoveTask = useUnit($$taskRemover.removeTaskById)

  return (
    <ContextMenu modal={contextMenu} child={children}>
      <Button
        onClick={() => {
          onRemoveTask(taskId)
          close()
        }}
        size="sm"
        className="py-1! text-red flex w-full items-center gap-x-2 text-left"
      >
        <Icon name="common/trash-can" />
        Delete
      </Button>
    </ContextMenu>
  )
}

type ContextMenuProps = {
  children: ReactNode
  child: ReactNode
  width?: number
  className?: string
  modal: Disclosure
}

export const ContextMenu = ({
  child,
  children,
  width = 200,
  className,
  modal,
}: ContextMenuProps) => {
  const dist = useRef(0)
  const { isOpened, open, close } = modal
  return (
    <div className="relative" onContextMenu={(e) => e.preventDefault()}>
      <Modal
        label="Context Menu"
        isOpened={isOpened}
        closeModal={close}
        overlay={false}
        portal={false}
      >
        <Modal.Content
          className={clsx(className)}
          styles={{ left: dist.current, top: 20, width }}
        >
          {children}
        </Modal.Content>
      </Modal>
      <div
        onContextMenu={(e) => {
          if (e.button != 2) return
          if (isOpened) return
          close()
          open()
          const t = e.target as HTMLElement
          const screenWidth = document.body.getBoundingClientRect().width
          const contextMenuWidth = width

          const bcr = t.getBoundingClientRect()
          const relativeXDist = e.clientX - bcr.left
          let moveToLeft = 0
          const spaceLeftForContextMenu = screenWidth - e.clientX
          if (spaceLeftForContextMenu < contextMenuWidth) {
            const padding = 10
            moveToLeft = contextMenuWidth - spaceLeftForContextMenu + padding
          }

          dist.current = relativeXDist - moveToLeft
        }}
      >
        {child}
      </div>
    </div>
  )
}
