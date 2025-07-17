import { useUnit } from "effector-react"
import { Project } from "./type"
import { $projects } from "./model"
import clsx from "clsx"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Link } from "atomic-router-react"
import { routes } from "@/shared/routing/router"

export const ProjectItem = ({project}: {project: Project}) => {
  return (
    <Link
      tabIndex={0} 
      params={{ projectId: project.id }}
      to={routes.project}
      className={clsx("cursor-pointer text-sm block", buttonCva({ intent: "primary", size: "base" }))}>
      {project.name}
    </Link>
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