//@ts-expect-error
import { RouterProvider } from 'atomic-router-react';
import { Suspense } from "react";

import { RoutesView } from "@/pages";
import { getTasksTriggered } from '@/entities/task';
import { router } from "@/shared/config/router/router";
getTasksTriggered()
function App() {
  return (
    <div className="text-white bg-main-blue h-full">
      <Suspense fallback={false}>
        <RouterProvider router={router}>
          <RoutesView />
        </RouterProvider> 
      </Suspense>
    </div>
  )
}
export default App
