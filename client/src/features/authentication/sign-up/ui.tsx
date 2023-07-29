import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"
import {
  $password,
  $passwordError,
  passwordChanged,
  submitTriggered,
} from "./signup.modal"
const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signup = ({ goBack }: { goBack: () => void }) => {
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
      <Button
        className="absolute -left-[20px]"
        onClick={goBack}
        intent={"primary"}
        size={"sm"}
      >
        <Icon
          name="common/arrow"
          className="text-4 rotate-180 text-cIconDefault"
        />
      </Button>
      <h2 className="mb-3 text-lg font-medium">Registration</h2>
      <p className="mb-7 text-sm">
        Creating an account using the address {email}
      </p>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => onSubmit(e, submit)}
      >
        <Input
          onChange={(e) => changePassword(e.target.value)}
          error={error}
          value={password}
          label="Password"
          className="mb-10"
          ref={ref}
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
      </form>
    </div>
  )
}
