import { RouterProvider } from 'atomic-router-react';
import { createEffect, sample } from 'effector';

import Cookies from 'universal-cookie'
import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task/tasks';
import { refreshQuery } from '@/shared/api/token';
import { appStarted } from '@/shared/config/init';
import { router } from "@/shared/config/router/router";

const cookies = new Cookies()
sample({
  clock: appStarted,
  target: [refreshQuery.start]
})
sample({
  clock: refreshQuery.finished.success,
  target: getTasksTriggered
})

sample({
  clock: appStarted,
  target: createEffect(() => {
    const theme = cookies.get('theme')
    if(theme){
      document.documentElement.setAttribute('data-theme', theme)
    }
    else {
      document.documentElement.setAttribute('data-theme', 'space')
    }
  })
})
function App() {
  return (
    <div className='h-screen text-primary'>
      <RouterProvider router={router}>
        <RoutesView />
      </RouterProvider> 
    </div>
  )
}
export default App

