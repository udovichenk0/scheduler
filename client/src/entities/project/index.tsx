import { useUnit } from "effector-react"
import clsx from "clsx"
import { Link } from "atomic-router-react"

import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { routes } from "@/shared/routing/router"

import { $projects } from "./model"
import { Project } from "./type"

export const ProjectItem = ({ project }: { project: Project }) => {
  return (
    <Link
      tabIndex={0}
      params={{ projectId: project.id }}
      to={routes.project}
      className={clsx(
        "block cursor-pointer text-sm",
        buttonCva({ intent: "primary", size: "base" }),
      )}
    >
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
