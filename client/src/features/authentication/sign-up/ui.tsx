import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"

import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"

import {
  $password,
  $passwordError,
  passwordChanged,
  submitTriggered,
} from "./signup.modal"
export const Signup = ({ goBack }: { goBack: () => void }) => {
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
      title={t("setting.synchronization.signup.title")}
      subtitle={t("setting.synchronization.signup.description", { email })}
      onArrowClick={goBack}
      onSubmit={onSubmit}
    >
      <Input
        onChange={(e) => changePassword(e.target.value)}
        error={error ? t(error) : null}
        value={password}
        label={t("setting.synchronization.signup.label")}
        className="mb-10"
        autoFocus
        ref={ref}
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
        {t("setting.synchronization.signup.resumeButtonTitle")}
      </Button>
    </AuthTemplate>
  )
}
