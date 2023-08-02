import { ReactNode } from "react"
import { Header } from "@/widgets/header"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon, IconName } from "@/shared/ui/icon/icon"
type PropsType = {
  children: ReactNode
  iconName: IconName
  title: string
  action: () => void,
  isTaskSelected: boolean,
  deleteTask: () => void
}

export const MainLayout = ({
  children,
  iconName,
  title,
  action,
  isTaskSelected,
  deleteTask
}: PropsType) => {
  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
      <Header icon={iconName} title={title} />
      <div className="h-full w-full scroll-pr-2.5 overflow-hidden overflow-y-scroll">
        {children}
      </div>
      <div className="px-2 py-2" onMouseDown={(e) => e.preventDefault()}>
        <Button
          onClick={() => action()}
          intent={"primary"}
          size={"base"}
          className="!text-accent"
        >
          <Icon name="common/plus" className="mr-4" />
          New Task
        </Button>
        <Button disabled={!isTaskSelected} onClick={deleteTask} intent={'primary'} size={'xs'}>
          <Icon name="common/trash-can" className={`text-[20px] ${isTaskSelected ? 'text-cIconDefault' : 'opacity-40'}`} />
        </Button>
      </div>
    </div>
  )
}
