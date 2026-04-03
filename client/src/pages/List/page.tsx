import { useStoreMap, useUnit } from "effector-react"
import { Layout } from "@/widgets/layout/main/ui"

import { InviteToProject } from "@/features/manage-project/ui/invite-to-project"

import { routes } from "@/shared/routing/router"

import {
  $$projectManager,
  $$projectModel,
  $$taskCreator,
  $$taskTrasher,
  $$taskUpdater,
  $listTasks,
} from "./model"
import { useTranslation } from "react-i18next"
import { TaskList } from "@/widgets/task/task-list"
import { Project } from "@/entities/project/type"
function findProjectList(
  projects: Project[],
  projectId: string,
  listId: string,
) {
  const project = projects.find((project) => project.id == projectId)
  if (!project) return null
  return project.lists.find((list) => list.id == listId) ?? null
}
const Page = () => {
  const params = useUnit(routes.list.$params)
  const { t } = useTranslation()
  const list = useStoreMap({
    store: $$projectModel.$projects,
    keys: [params.listId, params.projectId],
    fn: (projects) =>
      findProjectList(projects, params.projectId, params.listId),
  })
  if (!list) {
    return <div>no such list</div> // fix
  }

  return (
    <Layout title={t("task.inbox")}>
      <Layout.Header iconName="common/inbox" title="List" />
      <Layout.Content className="flex flex-col px-3">
        <InviteToProject
          projectManager={$$projectManager}
          projectId={params.projectId}
        />
        {list?.id && (
          <TaskList
            $tasks={$listTasks}
            $$taskCreator={$$taskCreator}
            $$taskTrasher={$$taskTrasher}
            $$taskUpdater={$$taskUpdater}
            listId={list.id}
          />
        )}
      </Layout.Content>
    </Layout>
  )
}

export default Page
