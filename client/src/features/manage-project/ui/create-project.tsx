import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { ModalName } from "@/shared/lib/disclosure/disclosure-names"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Modal } from "@/shared/ui/modal"
import { Input } from "@/shared/ui/data-entry/main-input"

import { createProject } from "../model"

export const CreateProjectModal = () => {
  const { t } = useTranslation()
  const { isOpened, open, close } = useDisclosure({
    id: ModalName.CreateProjectForm,
  })
  const [projectName, setProjectName] = useState<string>("")
  const onCreateProject = useUnit(createProject)
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        onClick={open}
        size={"sm"}
        className="w-full text-start"
        intent={"primary"}
      >
        <Icon name="common/plus" className="text-cOpacitySecondFont mr-4" />
        <span className="text-primary text-[12px]">{t("sidebar.project")}</span>
      </Button>
      <Modal isOpened={isOpened} label="Create Project" closeModal={close}>
        <Modal.Content className="bg-main-light w-[400px] overflow-hidden px-0 py-0">
          <Modal.Header className="mx-4 py-3">
            <Modal.Title fontSize="lg" pos="left">
              Create a Project
            </Modal.Title>
            <Modal.CloseButton close={close} />
          </Modal.Header>
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
                <Button intent="filled" className=" justify-self-end" size="xs">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}
