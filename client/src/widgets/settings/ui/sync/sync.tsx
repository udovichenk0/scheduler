import { useUnit, useGate } from "effector-react"
import { useTranslation } from "react-i18next"

import { CheckEmailForm } from "@/features/authentication/by-email"
import { Logout } from "@/features/authentication/logout"
import { Signin } from "@/features/authentication/sign-in"
import { Signup } from "@/features/authentication/sign-up"
import { VerifyEmail } from "@/features/authentication/verify-email"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"

import { $flow, flowChanged, gate, Flow } from "./sync.modal"

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
  const { t } = useTranslation()
  const selectForm = useUnit(flowChanged)
  return (
    <div className="text-center text-cFont">
      <Typography.Heading size="base" className="mb-2 font-semibold">
        {t("setting.synchronization.main.title")}
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-6">
        {t("setting.synchronization.main.description")}
      </Typography.Paragraph>
      <div className="text- inline-flex flex-col gap-5">
        <Button onClick={() => selectForm(Flow.email)} size={"lg"}>
          <Icon name="common/mail" className="mr-4 w-[15px] text-primary" />
          {t("setting.synchronization.main.withEmailButtonTitle")}
        </Button>
      </div>
    </div>
  )
}
