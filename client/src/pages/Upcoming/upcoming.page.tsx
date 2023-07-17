import { useUnit } from "effector-react"
import { useRef } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { AllUpcomingTasks } from "./sections/all-upcoming-tasks"
import { createTaskModel, taskModel } from "./upcoming.model"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    startDate,
    changeDate
  ] = useUnit([
    taskModel.closeTaskTriggered,
    taskModel.createTaskOpened,
    createTaskModel.$startDate,
    createTaskModel.dateChanged
  ])
  return (
    <MainLayout 
      action={() => createTaskOpened({ref})} 
      iconName="common/upcoming" title="Upcoming">
       <div className="h-full" onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}>
        <AllUpcomingTasks changeDate={changeDate} selectedDate={startDate} outRef={ref}/>
        </div>
    </MainLayout>
  )
}
