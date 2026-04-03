import { useState } from "react"

import { useUnit } from "effector-react"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { Dialog } from "@/shared/ui/disclosure/dialog"

import { ProjectManager } from "../model"

export const InviteToProject = ({
  projectManager,
  projectId,
}: {
  projectManager: ProjectManager
  projectId: string
}) => {
  const onInvite = useUnit(projectManager.inviteToProject)
  const [email, setEmail] = useState("")
  const { isOpened, open, close } = useDisclosure({
    id: ModalName.InviteUserToProject,
  })

  return (
    <div>
      <Dialog label="Invite to project" isOpened={isOpened} closeDialog={close}>
        <Button onClick={open} intent="filled" size="sm">
          Invite +
        </Button>
        <Dialog.Content className="bg-main-light p-0! w-[400px]">
          <Dialog.Header className="mx-5 py-4">
            Invite to project
            <Dialog.CloseButton />
          </Dialog.Header>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onInvite({ projectId, email })
            }}
          >
            <div className="px-5 py-4">
              <Input
                placeholder="Email"
                autoFocus
                className="text-sm placeholder:text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="bg-main border-t-cBorder flex w-full items-center justify-end gap-x-2 border-t px-4 py-3">
              <Button
                type="button"
                onClick={close}
                intent="primary"
                className="justify-self-end"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                intent="filled"
                className="justify-self-end"
                size="sm"
              >
                Invite
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}
