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
} from "./signin.modal"

export const Signin = ({ goBack }: { goBack: () => void }) => {
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
      title="Sign in"
      subtitle={`Login in to your account using the address ${email}`}
      onArrowClick={goBack}
    >
      <Input
        onChange={(e) => changePassword(e.target.value)}
        error={error}
        ref={ref}
        className="mb-10"
        value={password}
        autoFocus
        label="Password"
        type={isPasswordShown ? "text" : "password"}
        icon={
          <TogglePasswordButton
            isPasswordVisible={isPasswordShown}
            togglePasswordVisibility={togglePasswortView}
          />
        }
      />
      <span>
        <Button
          className={`${!password && "pointer-events-none bg-[#1f4964]"}`}
          disabled={!password}
          size={"m"}
          intent={"filled"}
        >
          Resume
        </Button>
      </span>
    </AuthTemplate>
  )
}
