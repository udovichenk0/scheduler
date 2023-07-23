import { useUnit, useGate } from "effector-react"
import { CheckEmailForm } from "@/features/authentication/by-email"
import { Logout } from "@/features/authentication/logout"
import { Signin } from "@/features/authentication/sign-in"
import { Signup } from "@/features/authentication/sign-up"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { $form, FormEnum, gate, formSelected } from "./sync.modal"

export const SynchronizationTab = () => {
  useGate(gate)
  return (
    <div className="flex justify-center">
      <div className="w-[391px] text-primary">
        <Content/>
      </div>
    </div>
  )
}

function Content(){
  const [
    form, 
    selectForm
  ] = useUnit([
    $form, 
    formSelected
  ])

  if(form === FormEnum.email){
    return <CheckEmailForm goBack={() => selectForm(FormEnum.options)}/>
  }
  if(form === FormEnum.login){
    return <Signin goBack={() => selectForm(FormEnum.email)}/>
  }
  if(form === FormEnum.register){
    return <Signup goBack={() => selectForm(FormEnum.email)}/>
  }
  if(form === FormEnum.logout){
    return <Logout/>
  }
  return (
    <div className="text-center text-cFont">
      <h2 className="text-lg mb-2 font-semibold">Welcome to Scheduler App</h2>
      <p className="text-sm mb-6">Log in to access your your account and sync the data between devices</p>
      <div className="inline-flex flex-col gap-5 text-">
        <Button onClick={() => selectForm(FormEnum.email)} size={'lg'}>
          <Icon name="common/mail" className="text-primary w-[15px] mr-4"/>
          Continue with Email
        </Button>
        <Button size={'lg'}>
          <Icon name="common/mail" className="text-primary w-[15px] mr-4"/>
          Continue with Google
        </Button>
        <Button size={'lg'}>
          <Icon name="common/mail" className="text-primary w-[15px] mr-4" />
          Continue with Apple
        </Button>
      </div>
    </div>
  )
}