import { ReactNode } from "react"
/* eslint-disable boundaries/element-types */
import { Sidebar } from "@/widgets/sidebar/ui"
import { Button } from "@/shared/ui/buttons/main-button"
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
          <Button 
            onClick={() => action()} 
            title="New Task" 
            icon={<Icon name="common/plus"/>} 
            intent={'primary'} 
            size={'base'} 
            className="!text-accent"/>
        </div>
      </div>
    </div>
  )
}