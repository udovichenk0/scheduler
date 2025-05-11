import { useUnit, useGate } from "effector-react"
import { useTranslation } from "react-i18next"
import { useEffect, useRef } from "react"

import { CheckEmailForm } from "@/features/authentication/check-email/ui.tsx"
import { Logout } from "@/features/authentication/logout/ui.tsx"
import { Signin } from "@/features/authentication/sign-in/ui.tsx"
import { Signup } from "@/features/authentication/sign-up/ui.tsx"
import { VerifyEmail } from "@/features/verify-email/ui.tsx"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"

import { $flow, flowChanged, gate, Flow } from "./sync.model"

export const Authentication = () => {
  const currentFlow = useUnit($flow)
  const selectForm = useUnit(flowChanged)

  useGate(gate)
  return (
    <div className="flex justify-center">
      <div className="text-primary w-[420px]">
        {currentFlow === Flow.email && (
          <CheckEmailForm goBack={() => selectForm(Flow.options)} />
        )}
        {currentFlow === Flow.login && (
          <Signin goBack={() => selectForm(Flow.email)} />
        )}
        {currentFlow === Flow.register && (
          <Signup goBack={() => selectForm(Flow.email)} />
        )}
        {currentFlow === Flow.logout && <Logout />}
        {currentFlow === Flow.options && <AuthOptions />}
        {currentFlow === Flow.verify && (
          <VerifyEmail goBack={() => selectForm(Flow.email)} />
        )}
      </div>
    </div>
  )
}

const AuthOptions = () => {
  const { t } = useTranslation()
  const selectForm = useUnit(flowChanged)
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div className="text-cFont text-center">
      <Typography.Heading size="base" className="mb-2 font-semibold">
        {t("setting.synchronization.main.title")}
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-6">
        {t("setting.synchronization.main.description")}
      </Typography.Paragraph>
      <div className="text- inline-flex flex-col gap-5">
        <Button ref={ref} onClick={() => selectForm(Flow.email)} size={"lg"}>
          <Icon name="common/mail" className="text-primary mr-4 w-[15px]" />
          {t("setting.synchronization.main.withEmailButtonTitle")}
        </Button>
      </div>
    </div>
  )
}
