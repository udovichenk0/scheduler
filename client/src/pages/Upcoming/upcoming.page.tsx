import { useUnit } from "effector-react"
import { useRef } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { AllUpcomingTasks } from "./sections/all-upcoming-tasks"
import { taskModel } from "./upcoming.model"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
  ] = useUnit([
    taskModel.closeTaskTriggered,
    taskModel.createTaskOpened,
  ])
  return (
    <MainLayout 
      action={() => createTaskOpened({ref})} 
      iconName="common/upcoming" title="Upcoming">
       <div className="h-full" onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}>
        <AllUpcomingTasks outRef={ref}/>
        </div>
    </MainLayout>
  )
}
