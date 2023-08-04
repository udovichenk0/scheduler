import { useUnit, useGate } from "effector-react"

import { CheckEmailForm } from "@/features/authentication/by-email"
import { Logout } from "@/features/authentication/logout"
import { Signin } from "@/features/authentication/sign-in"
import { Signup } from "@/features/authentication/sign-up"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"

import { $form, FormEnum, gate, formSelected } from "./sync.modal"

export const SynchronizationTab = () => {
  const [form, selectForm] = useUnit([$form, formSelected])
  useGate(gate)
  return (
    <div className="flex justify-center">
      <div className="w-[391px] text-primary">
        {form === FormEnum.email && (
          <CheckEmailForm goBack={() => selectForm(FormEnum.options)} />
        )}
        {form === FormEnum.login && (
          <Signin goBack={() => selectForm(FormEnum.email)} />
        )}
        {form === FormEnum.register && (
          <Signup goBack={() => selectForm(FormEnum.email)} />
        )}
        {form === FormEnum.logout && <Logout />}
        {form === FormEnum.options && <AuthOptions />}
      </div>
    </div>
  )
}

const AuthOptions = () => {
  const selectForm = useUnit(formSelected)
  return (
    <div className="text-center text-cFont">
      <Typography.Heading size="base" className="mb-2 font-semibold">
        Welcome to Scheduler App
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-6">
        Log in to access your your account and sync the data between devices
      </Typography.Paragraph>
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
