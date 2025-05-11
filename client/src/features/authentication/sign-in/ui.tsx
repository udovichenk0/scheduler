import { useUnit } from "effector-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"

import { $email } from "../check-email/model.ts"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"

import {
  $password,
  $error,
  passwordChanged,
  submitTriggered,
} from "./signin.model"

export const Signin = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()

  const password = useUnit($password)
  const error = useUnit($error)
  const email = useUnit($email)
  const changePassword = useUnit(passwordChanged)
  const onSubmit = useUnit(submitTriggered)

  const [isPasswordShown, togglePasswortView] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <AuthTemplate
      onSubmit={onSubmit}
      title={t("setting.synchronization.signin.title")}
      subtitle={t("setting.synchronization.signin.description", { email })}
      onArrowClick={goBack}
    >
      <Input
        onChange={(e) => changePassword(e.target.value)}
        error={error ? t(error) : null}
        ref={ref}
        className="mb-5"
        value={password}
        autoFocus
        label={t("setting.synchronization.signin.label")}
        type={isPasswordShown ? "text" : "password"}
        icon={
          <TogglePasswordButton
            isPasswordVisible={isPasswordShown}
            togglePasswordVisibility={togglePasswortView}
          />
        }
      />
      <Button
        className={`${!password && "pointer-events-none bg-[#1f4964]"}`}
        disabled={!password}
        size={"m"}
        intent={"filled"}
      >
        {t("setting.synchronization.signin.resumeButtonTitle")}
      </Button>
    </AuthTemplate>
  )
}
