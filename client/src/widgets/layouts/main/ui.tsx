import { ReactNode } from "react"
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
    <div className="w-full grid grid-rows-[auto_1fr_auto] h-screen">
      <Header icon={iconName} title={title}/>
      <div className="overflow-hidden overflow-y-scroll scroll-pr-2.5 h-full w-full">
        {children}
      </div>
      <div className="px-2 py-2">
        <Button 
          onClick={() => action()} 
          intent={'primary'} 
          size={'base'} 
          className="!text-accent">
            <Icon name="common/plus" className="mr-4"/>
            New Task
          </Button>
      </div>
    </div>
  )
}