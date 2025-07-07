import { useUnit } from "effector-react"
import { Project } from "./type"
import { $projects } from "./model"
import clsx from "clsx"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"

export const ProjectItem = ({project}: {project: Project}) => {
  return (
    <div tabIndex={0} className={clsx("cursor-pointer text-sm", buttonCva({ intent: "primary", size: "base" }))}>
      {project.name}
    </div>
  )
}

export const ProjectList = () => {
  const projects = useUnit($projects)
  return (
    <div>
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}