import { useStoreMap, useUnit } from "effector-react"
import { useState } from "react"
import { clsx } from "clsx"

import { Layout } from "@/widgets/layout/main/ui"

import { InviteToProject } from "@/features/manage-project/ui/invite-to-project"

import { routes } from "@/shared/routing/router"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Tabs } from "@/shared/ui/tab"

import { Calendar } from "./view/calendar"
import { View, views } from "./config"
import { ViewType } from "./type"
import { List } from "./view/list"
import { $$projectManager, $$projectModel, $projectTasks } from "./model"

const Project = () => {
  const params = useUnit(routes.project.$params)
  const [tab, setTab] = useState<ViewType>(View.LIST)
  const project = useStoreMap({
    store: $$projectModel.$projects,
    keys: [params.projectId],
    fn: (projects, [pId]) => {
      return projects.find((p) => p.id === pId) || null
    },
  })

  if (!project) {
    return <div>no project</div> //!FIX
  }

  return (
    <Layout title="Project">
      <Layout.Header iconName="common/arrow" title={project.name} />
      <Layout.Content>
        <Tabs value={tab} onChange={setTab} className="text-cFont">
          <div className="border-b-cBorder flex items-center justify-between border-b px-4">
            <Tabs.List className="flex gap-x-2">
              {views.map((view) => {
                return (
                  <div
                    key={view}
                    data-active={tab === view}
                    className="data-[active=true]:border-b-3 border-cPrimary py-2"
                  >
                    <Tabs.Trigger
                      data-active={tab === view}
                      value={view}
                      className={clsx(
                        buttonCva({ intent: "primary", size: "sm" }),
                        "data-[active=true]:bg-hover capitalize",
                      )}
                    >
                      {view}
                    </Tabs.Trigger>
                  </div>
                )
              })}
            </Tabs.List>
            <InviteToProject
              projectManager={$$projectManager}
              projectId={project.id}
            />
          </div>
          <Tabs.Content className="p-4" label="list">
            <List $tasks={$projectTasks} />
          </Tabs.Content>
          <Tabs.Content label="calendar">
            <Calendar $tasks={$projectTasks} />
          </Tabs.Content>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Project
