//@ts-expect-error
import { RouterProvider } from 'atomic-router-react';
import { Suspense } from "react";

import { RoutesView } from "@/pages";
import { appStarted } from "@/shared/config/init";
import { router } from "@/shared/config/router/router";

appStarted()
function App() {
  return (
    <div className="text-white bg-main-blue">
      <Suspense fallback={false}>
        <RouterProvider router={router}>
          <RoutesView />
          {/* <button onClick={() => modal.toggleTriggered()}>Open modal</button>
          <AuthModal modal={modal}>
              <div>
                  asdf
              </div>
          </AuthModal> */}
        </RouterProvider>
      </Suspense>
    </div>
  )
}

export default App
