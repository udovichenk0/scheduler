import { routes } from "@/shared/routing/router"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Link } from "atomic-router-react"
import clsx from "clsx"
import { List } from "./type"
// import { PreviewList } from "./type"

type ListItemProps = {
  projectId: string
  listId: string
  name: string
}

const ListItem = ({ projectId, listId, name }: ListItemProps) => {
  return (
    <Link
      className={clsx("inline-block w-full", buttonCva({ size: "xs" }))}
      params={{
        projectId: projectId,
        listId: listId,
      }}
      to={routes.list}
    >
      {name}
    </Link>
  )
}

export const ListItems = ({ lists }: { lists: List[] }) => {
  return (
    <div className="border-cBorder ml-2 border-l-2 pl-2">
      {lists.map((list) => {
        return (
          <ListItem
            key={list.id}
            projectId={list.projectId}
            listId={list.id}
            name={list.name}
          />
        )
      })}
    </div>
  )
}
