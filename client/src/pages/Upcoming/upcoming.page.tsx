import { useUnit } from "effector-react"
import { useRef } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import { $selectedDate, currentDateSelected, taskModel } from "./upcoming.model"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    startDate,
    changeDate
  ] = useUnit([
    taskModel.closeTaskTriggered,
    taskModel.createTaskToggled,
    $selectedDate,
    currentDateSelected
  ])
  return (
    <MainLayout 
      action={() => createTaskOpened({date: startDate})} 
      iconName="common/upcoming" title="Upcoming">
       <div className="h-full" onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}>
        <AllUpcomingTasks changeDate={changeDate} selectedDate={startDate} outRef={ref}/>
        </div>
    </MainLayout>
  )
}
