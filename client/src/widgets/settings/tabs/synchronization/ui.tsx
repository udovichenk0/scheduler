import { useUnit, useGate } from "effector-react"
import { ByEmailForm } from "@/features/authentication/by-email"
import { Logout } from "@/features/authentication/logout"
import { Signin } from "@/features/authentication/sign-in"
import { Signup } from "@/features/authentication/sign-up"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
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
    <div className="flex flex-col items-center">
      <div className="w-[391px] text-">
        {formToShow === FormEnum.options && <LoginOptions onClick={() => setForm(FormEnum.email)}/>}
        {formToShow === FormEnum.email && <ByEmailForm goBack={() => setForm(FormEnum.options)}/>}
        {formToShow === FormEnum.login && <Signin goBack={() => setForm(FormEnum.email)}/>}
        {formToShow === FormEnum.register && <Signup goBack={() => setForm(FormEnum.email)}/>}
        {formToShow === FormEnum.logout && <Logout/>}
      </div>
    </div>
  )
}


function LoginOptions({onClick}:{onClick: () => void}){
  return (
    <div className="text-center text-cFont">
      <h2 className="text-lg mb-2 font-semibold">Welcome to Scheduler App</h2>
      <p className="text-sm mb-6">Log in to access your your account and sync the data between devices</p>
      <div className="inline-flex flex-col gap-5 text-">
        <Button onClick={() => onClick()} icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Email" size={'lg'} />
        <Button icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Google" size={'lg'} />
        <Button icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Apple" size={'lg'} />
      </div>
    </div>
  )
}
