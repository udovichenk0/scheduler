import { RouterProvider } from 'atomic-router-react';
import { sample } from 'effector';
import { RoutesView } from "@/pages";
import { setSessionUserTriggered } from '@/entities/session';
import { getTasksTriggered } from '@/entities/task';
import { refreshQuery } from '@/shared/api/token';
import { router } from "@/shared/config/router/router";
getTasksTriggered()
refreshQuery.start()
sample({
  clock: refreshQuery.finished.success,
  fn: ({result}) => result.user,
  target: setSessionUserTriggered
})
sample({
  clock: refreshQuery.finished.success,
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

