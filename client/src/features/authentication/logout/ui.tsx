import { useUnit } from "effector-react/compat"
import { FormEvent } from "react"
import { $sessionUser } from "@/entities/session/session.model"
import { submitTriggered } from "./logout.model"
const submitLogout = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}

export const Logout = () => {
  const [user, submit] = useUnit([$sessionUser, submitTriggered])
  return (
    <div className="text-cFont">
      <h2 className="mb-3 text-lg font-medium">Logout</h2>
      <h1 className="mb-3">{user?.email || "myemail@gmail.com"}</h1>
      <form action="" onSubmit={(e) => submitLogout(e, submit)}>
        <button className="w-[132px] rounded-[5px] bg-[#2384b9] py-1 text-sm text-white outline-none transition-colors duration-150 hover:bg-[#1e6795]">
          Quit
        </button>
      </form>
    </div>
  )
}
