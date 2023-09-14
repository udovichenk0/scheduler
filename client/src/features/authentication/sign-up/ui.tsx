import { useUnit } from "effector-react"
import { useRef, useState } from "react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/data-entry/main-input"
import { AuthTemplate } from "@/shared/ui/templates/auth/ui"

import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"

import {
  $password,
  $passwordError,
  passwordChanged,
  submitTriggered,
} from "./signup.modal"
export const Signup = ({ goBack }: { goBack: () => void }) => {
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
      title="Registration"
      subtitle={`Creating an account using the address ${email}`}
      onArrowClick={goBack}
      onSubmit={onSubmit}
    >
      <Input
        onChange={(e) => changePassword(e.target.value)}
        error={error}
        value={password}
        label="Password"
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
        Resume
      </Button>
    </AuthTemplate>
  )
}
