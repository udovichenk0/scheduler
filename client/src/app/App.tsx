import { RouterProvider } from 'atomic-router-react';
import { sample } from 'effector';
import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task';
import { getTaskQuery } from '@/shared/api/task';
import { refreshQuery } from '@/shared/api/token';
import { appStarted } from '@/shared/config/init';
import { router } from "@/shared/config/router/router";

getTasksTriggered()

sample({
  clock: appStarted,
  target: [refreshQuery.start]
})
sample({
  clock: refreshQuery.finished.success,
  target: getTaskQuery.start
})

function App() {
  return (
    <div className="text-white bg-main-blue h-screen">
        <RouterProvider router={router}>
            <RoutesView />
        </RouterProvider> 
    </div>
  )
}
export default App

