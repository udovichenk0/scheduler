import { List } from "./list/type"
type DefaultProjectFields = {
  id: string
  name: string
  createdBy: string
  isPrivate: boolean
}
export type Project = {
  lists: List[]
} & DefaultProjectFields

export type PrivateProject = {
  list: List
} & DefaultProjectFields
