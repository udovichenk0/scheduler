import { RouterProvider } from 'atomic-router-react';
import {extend} from "dayjs"
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { sample } from 'effector';
import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task/tasks';
import { refreshQuery } from '@/shared/api/token';
import { appStarted } from '@/shared/config/init';
import { router } from "@/shared/config/router/router";

extend(isSameOrAfter)
extend(isSameOrBefore)

sample({
  clock: appStarted,
  target: [refreshQuery.start]
})
sample({
  clock: refreshQuery.finished.success,
  target: getTasksTriggered
})

function App() {
  return (
    <RouterProvider router={router}>
      <RoutesView />
    </RouterProvider> 
  )
}
export default App

