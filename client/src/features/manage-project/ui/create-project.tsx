import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { Dialog } from "@/shared/ui/disclosure/dialog"
import { Input } from "@/shared/ui/data-entry/main-input"

import { ProjectManager } from "../model"

export const CreateProjectModal = ({
  projectManager,
}: {
  projectManager: ProjectManager
}) => {
  const { t } = useTranslation()
  const { isOpened, open, close } = useDisclosure({
    id: ModalName.CreateProjectForm,
  })
  const [projectName, setProjectName] = useState<string>("")
  const onCreateProject = useUnit(projectManager.createProject)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        onClick={open}
        size={"xs"}
        className="w-full text-start"
        intent={"primary"}
        icon={{
          left: {
            name: "common/plus",
          },
        }}
      >
        <span className="text-primary text-[12px]">{t("sidebar.project")}</span>
      </Button>
      <Dialog isOpened={isOpened} label="Create Project" closeDialog={close}>
        <Dialog.Content className="bg-main-light w-100 overflow-hidden px-0 py-0">
          <Dialog.Header className="mx-4 py-3">
            <Dialog.Title fontSize="lg" pos="left">
              Create a Project
            </Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onCreateProject({ name: projectName })
              }}
            >
              <div className="px-4">
                <Input
                  placeholder="Project Name"
                  autoFocus
                  ref={ref}
                  className="text-sm placeholder:text-xs"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="bg-main border-t-cBorder grid w-full border-t px-4 py-2">
                <Button intent="filled" className="justify-self-end" size="xs">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
