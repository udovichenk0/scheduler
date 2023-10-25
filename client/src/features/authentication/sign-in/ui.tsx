import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"

import { $email } from "../check-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"

import {
  $password,
  $passwordError,
  passwordChanged,
  submitTriggered,
} from "./signin.modal"

export const Signin = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()

  const [password, error, email, changePassword, onSubmit] = useUnit([
    $password,
    $passwordError,
    $email,
    passwordChanged,
    submitTriggered,
  ])
  const [isPasswordShown, togglePasswortView] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
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
        className="mb-10"
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
