import { useUnit } from "effector-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"

import { $email, $error, emailChanged, submitTriggered } from "./model"

export const CheckEmailForm = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)

  const email = useUnit($email)
  const error = useUnit($error)
  const changeEmail = useUnit(emailChanged)
  const onSubmit = useUnit(submitTriggered)
  return (
    <AuthTemplate
      title={t("setting.synchronization.byEmail.title")}
      subtitle={t("setting.synchronization.main.description")}
      onArrowClick={goBack}
      onSubmit={onSubmit}
    >
      <Input
        onChange={(e) => changeEmail(e.target.value)}
        error={error}
        autoFocus
        className="mb-5"
        ref={ref}
        value={email}
        label={t("setting.synchronization.byEmail.label")}
      />
      <Button intent={"filled"} size={"m"} disabled={!email}>
        {t("setting.synchronization.byEmail.continueButtonTitle")}
      </Button>
    </AuthTemplate>
  )
}
