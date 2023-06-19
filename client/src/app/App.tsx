import { RouterProvider } from 'atomic-router-react';
import { sample } from 'effector';
import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task';
import { refreshQuery } from '@/shared/api/token';
import { appStarted } from '@/shared/config/init';
import { router } from "@/shared/config/router/router";
import { ThemeProvider } from './providers';

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
    <div className="text-white bg-main-blue h-screen">
      <ThemeProvider>
        <RouterProvider router={router}>
          <RoutesView />
        </RouterProvider> 
      </ThemeProvider>
    </div>
  )
}
export default App

