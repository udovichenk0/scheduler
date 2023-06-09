import { RouterProvider } from 'atomic-router-react';
import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task';
import { router } from "@/shared/config/router/router";
getTasksTriggered()

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
