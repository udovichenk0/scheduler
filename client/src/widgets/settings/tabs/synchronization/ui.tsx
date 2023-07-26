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
        <Content />
      </div>
    </div>
  )
}

function Content() {
  const [form, selectForm] = useUnit([$form, formSelected])

  if (form === FormEnum.email) {
    return <CheckEmailForm goBack={() => selectForm(FormEnum.options)} />
  }
  if (form === FormEnum.login) {
    return <Signin goBack={() => selectForm(FormEnum.email)} />
  }
  if (form === FormEnum.register) {
    return <Signup goBack={() => selectForm(FormEnum.email)} />
  }
  if (form === FormEnum.logout) {
    return <Logout />
  }
  return (
    <div className="text-center text-cFont">
      <h2 className="mb-2 text-lg font-semibold">Welcome to Scheduler App</h2>
      <p className="mb-6 text-sm">
        Log in to access your your account and sync the data between devices
      </p>
      <div className="text- inline-flex flex-col gap-5">
        <Button onClick={() => selectForm(FormEnum.email)} size={"lg"}>
          <Icon name="common/mail" className="mr-4 w-[15px] text-primary" />
          Continue with Email
        </Button>
        <Button size={"lg"}>
          <Icon name="common/mail" className="mr-4 w-[15px] text-primary" />
          Continue with Google
        </Button>
        <Button size={"lg"}>
          <Icon name="common/mail" className="mr-4 w-[15px] text-primary" />
          Continue with Apple
        </Button>
      </div>
    </div>
  )
}
