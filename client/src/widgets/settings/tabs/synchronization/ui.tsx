import { useUnit, useGate } from "effector-react"
import { ByEmailForm } from "@/features/authentication/by-email"
import { Logout } from "@/features/authentication/logout"
import { Signin } from "@/features/authentication/sign-in"
import { Signup } from "@/features/authentication/sign-up"
import { LoginOptions } from "./login-options"
import { $formToShow, FormEnum, gate, setFormTriggered } from "./sync.modal"

export const SynchronizationTab = () => {
  const [
    formToShow, 
    setForm
  ] = useUnit([
    $formToShow, 
    setFormTriggered
  ])
  useGate(gate)
  return (
    <div className="flex justify-center">
      <div className="w-[391px] text-primary">
        {formToShow === FormEnum.options && <LoginOptions />}
        {formToShow === FormEnum.email && <ByEmailForm goBack={() => setForm(FormEnum.options)}/>}
        {formToShow === FormEnum.login && <Signin goBack={() => setForm(FormEnum.email)}/>}
        {formToShow === FormEnum.register && <Signup goBack={() => setForm(FormEnum.email)}/>}
        {formToShow === FormEnum.logout && <Logout/>}
      </div>
    </div>
  )
}