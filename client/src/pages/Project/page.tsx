import { useStoreMap, useUnit } from "effector-react"
import { useState } from "react"
import clsx from "clsx"

import { Layout } from "@/widgets/layout/main/ui"

import { $projects } from "@/entities/project/model"

import { routes } from "@/shared/routing/router"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Tabs } from "@/shared/ui/tab"

import { views } from "./config"
import { ViewType } from "./type"
import { $$taskModel } from "./model"
import { List } from "./view/list"

const Project = () => {
  const params = useUnit(routes.project.$params)
  const [tab, setTab] = useState<ViewType>("list")
  const project = useStoreMap({
    store: $projects,
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
          <Tabs.List className="border-b-cBorder flex gap-x-2 border-b px-4">
            {views.map((view) => {
              return (
                <div
                  data-active={tab === view}
                  className="data-[active=true]:border-b-3 border-cPrimary py-2"
                >
                  <Tabs.Trigger
                    value={view}
                    className={clsx(
                      buttonCva({ intent: "primary", size: "sm" }),
                      "capitalize",
                    )}
                  >
                    {view}
                  </Tabs.Trigger>
                </div>
              )
            })}
          </Tabs.List>
          <Tabs.Content label="list">
            <List $tasks={$$taskModel.$tasks} />
          </Tabs.Content>
          <Tabs.Content label="calendar">
            <div>calendar</div>
          </Tabs.Content>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Project
