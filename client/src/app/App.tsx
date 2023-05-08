import { AuthModal } from "../shared/ui/modals/auth-modal/ui";
import { modalFactory } from "../shared/lib/modal";
//@ts-expect-error
import { RouterProvider } from 'atomic-router-react';
import { RoutesView } from "@/pages";
import { router } from "@/shared/config/router/router";
import { appStarted } from "@/shared/config/init";
import { Suspense } from "react";
appStarted()
const modal = modalFactory()
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
