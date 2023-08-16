import { useUnit, useGate } from "effector-react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"

import { CheckEmailForm } from "./by-email"
import { Logout } from "./logout"
import { $flow, flowChanged, gate, Flow } from "./model"
import { Signin } from "./sign-in"
import { Signup } from "./sign-up"
import { VerifyEmail } from "./verify-email/ui"

export const Authentication = () => {
  const [form, selectForm] = useUnit([$flow, flowChanged])
  useGate(gate)
  return (
    <div className="flex justify-center">
      <div className="w-[391px] text-primary">
        {form === Flow.email && (
          <CheckEmailForm goBack={() => selectForm(Flow.options)} />
        )}
        {form === Flow.login && (
          <Signin goBack={() => selectForm(Flow.email)} />
        )}
        {form === Flow.register && (
          <Signup goBack={() => selectForm(Flow.email)} />
        )}
        {form === Flow.logout && <Logout />}
        {form === Flow.options && <AuthOptions />}
        {form === Flow.verify && (
          <VerifyEmail goBack={() => selectForm(Flow.email)} />
        )}
      </div>
    </div>
  )
}

const AuthOptions = () => {
  const selectForm = useUnit(flowChanged)
  return (
    <div className="text-center text-cFont">
      <Typography.Heading size="base" className="mb-2 font-semibold">
        Welcome to Scheduler App
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-6">
        Log in to access your your account and sync the data between devices
      </Typography.Paragraph>
      <div className="text- inline-flex flex-col gap-5">
        <Button onClick={() => selectForm(Flow.email)} size={"lg"}>
          <Icon name="common/mail" className="mr-4 w-[15px] text-primary" />
          Continue with Email
        </Button>
      </div>
    </div>
  )
}
