import { $projects } from "@/entities/project/model"
import { routes } from "@/shared/routing/router"
import { buttonCva } from "@/shared/ui/buttons/main-button/cva.styles"
import { Tabs } from "@/shared/ui/tab"
import { Layout } from "@/widgets/layout/main/ui"
import { useStoreMap, useUnit } from "effector-react"
import { useState } from "react"
import { views } from "./config"
import clsx from "clsx"
import { ViewType } from "./type"
import { $projectTasks } from "./model"
import { List } from "./view/list"

const Project = () => {
  const params = useUnit(routes.project.$params)
  const [tab, setTab] = useState<ViewType>("list")
  const project = useStoreMap({
    store: $projects,
    keys: [params.projectId],
    fn: (projects, [pId]) => {
      return projects.find((p) => p.id === pId) || null
    }
  })

  if(!project){
    return <div>no project</div> //!FIX
  }

  return (
    <Layout title="Project">
      <Layout.Header iconName="common/arrow" title={project.name} />
      <Layout.Content>
        <Tabs value={tab} onChange={setTab} className="text-cFont">
          <Tabs.List className="flex border-b border-b-cBorder px-4 gap-x-2">
            {views.map((view) => {
              return (
                <div data-active={tab === view} className="py-2 data-[active=true]:border-b-3 border-cPrimary">
                  <Tabs.Trigger 
                    value={view}
                    className={clsx(buttonCva({intent: "primary", size: "sm"}), "capitalize")}>
                      {view}
                  </Tabs.Trigger>
                </div>
              )
            })}
          </Tabs.List>
          <Tabs.Content label="list">
            <List $tasks={$projectTasks}/>
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