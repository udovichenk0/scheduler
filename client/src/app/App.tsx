import { RouterProvider } from 'atomic-router-react';
import { RoutesView } from "@/pages";
import { Sidebar } from '@/widgets/sidebar';
import { router } from "@/shared/config/router/router";


function App() {
  return (
    <RouterProvider router={router}>
      <div className='flex w-full bg-main'>
        <Sidebar />
        <RoutesView />
      </div>
    </RouterProvider> 
  )
}

if(typeof window != 'undefined') {
  const theme = localStorage.getItem('data-theme')
  const accent = localStorage.getItem('data-accent')

  if(theme){
    document.documentElement.setAttribute('data-theme', JSON.parse(theme))
  }
  else if(accent){
    document.documentElement.style.setProperty('--accent', `var(--${JSON.parse(accent)})`)
  }
  else if(!theme) {
    document.documentElement.setAttribute('data-theme', 'default')
  }
}
export default App

