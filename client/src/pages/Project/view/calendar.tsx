import { Store } from "effector"
import { useUnit } from "effector-react"

import { CalendarWidget } from "@/widgets/calendar/calendar"

import { Task } from "@/entities/task/type"

import {
  $$taskCreator,
  $$taskTrasher,
  $$taskUpdater,
  projectRoute,
} from "../model"

export const Calendar = ({ $tasks }: { $tasks: Store<Task[]> }) => {
  const params = useUnit(projectRoute.$params)
  return (
    <div>
      <CalendarWidget
        $$taskCreator={$$taskCreator}
        $$taskTrasher={$$taskTrasher}
        $$taskUpdater={$$taskUpdater}
        projectId={params.projectId}
        $tasks={$tasks}
      />
    </div>
  )
}
