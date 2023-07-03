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
    const accent = cookies.get('accent')
    if(theme){
      document.documentElement.setAttribute('data-theme', theme)
    }
    if(accent){
      document.documentElement.style.setProperty('--accent', `var(--${accent})`)
    }
    if(!theme){
      document.documentElement.setAttribute('data-theme', 'space')
    }
    if(!accent){
      document.documentElement.style.setProperty('--accent', 'var(--blue)')
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

