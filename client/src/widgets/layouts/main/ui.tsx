import { ReactNode } from "react"
/* eslint-disable boundaries/element-types */
import { Sidebar } from "@/widgets/sidebar/ui"
import { Icon, IconName } from "@/shared/ui/icon/icon"
import { Header } from "./ui/header"

type PropsType = {
	children: ReactNode,
	iconName: IconName,
	title: string,
	action: () => void
}

export const MainLayout = ({ children, iconName, title, action }: PropsType) => {
  return (
    <div className={`flex h-screen bg-main`}>
      <Sidebar />
      <div className="w-full h-full grid grid-rows-[auto_1fr_auto]">
        <Header icon={iconName} title={title}/>
        {children}
        <div className="px-2 py-2">
          <CreateTask action={action}/>
        </div>
      </div>
    </div>
  )
}

function CreateTask({action}:{action: () => void}){
  return (
    <button onClick={() => action()} className="text-accent py-2 px-3 rounded-[5px] hover:bg-cHover text-sm flex items-center gap-2">
      <Icon name="common/plus"/>
      <span>New Task</span>
    </button>
  )
}