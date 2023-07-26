import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"
import {
  $password,
  $passwordError,
  passwordChanged,
  submitTriggered,
} from "./signin.modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signin = ({ goBack }: { goBack: () => void }) => {
  const [password, error, email, changePassword, submit] = useUnit([
    $password,
    $passwordError,
    $email,
    passwordChanged,
    submitTriggered,
  ])
  const [isPasswordShown, togglePasswortView] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current && ref.current.focus()
  }, [])
  return (
    <div className="relative text-center text-cFont">
      <span className="absolute left-[-20px]">
        <IconButton
          className="rotate-180"
          intent={"primary"}
          size={"m"}
          iconName="common/arrow"
          onClick={() => goBack()}
        />
      </span>
      <h2 className="mb-3 text-lg font-semibold">Authorization</h2>
      <p className="mb-7 text-sm">
        Login in to your account using the address {email}
      </p>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => onSubmit(e, submit)}
      >
        <Input
          onChange={(e) => changePassword(e.target.value)}
          error={error}
          ref={ref}
          className="mb-10"
          value={password}
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
          <DisableButton disabled={!password} />
        </span>
      </form>
    </div>
  )
}
