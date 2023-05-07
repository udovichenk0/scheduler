import {AuthModal} from "../shared/ui/modals/auth-modal/ui";
import {modalFactory} from "../shared/lib/modal";


const modal = modalFactory()
function App() {

  return (
    <>
        <button onClick={() => modal.toggleTriggered()}>Open modal</button>
      <AuthModal modal={modal}>
          <div>
              asdf
          </div>
      </AuthModal>
    </>
  )
}

export default App
