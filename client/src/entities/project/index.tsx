import { useUnit } from "effector-react"
import { clsx } from "clsx"

import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"

import { Project } from "./type"
import { Button } from "@/shared/ui/buttons/main-button"
import { useState } from "react"
import { ProjectModel } from "./model"
import { ListItems } from "./list"
import { routes } from "@/shared/routing/router"

const ProjectItem = ({ project }: { project: Project }) => {
  const isListRouteOpened = useUnit(routes.list.$isOpened)
  const activeProjectId = useUnit(routes.list.$params)

  const [listExpanded, setListExpanded] = useState(
    !!isListRouteOpened && !!activeProjectId,
  )
  const clickOnItem = () => {
    setListExpanded(!listExpanded)
  }

  return (
    <div>
      <Button
        onClick={clickOnItem}
        className={clsx(
          "mb-1 block w-full cursor-pointer text-sm",
          buttonCva({ intent: "primary", size: "xs" }),
        )}
      >
        {project.name}
      </Button>
      {listExpanded && <ListItems lists={project.lists} />}
    </div>
  )
}

export const ProjectList = ({
  $projectModel,
}: {
  $projectModel: ProjectModel
}) => {
  const projects = useUnit($projectModel.$projects)

  return (
    <div className="mb-1">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}
