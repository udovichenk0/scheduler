import { useUnit } from "effector-react"
import { FormEvent, useRef, useState } from "react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/data-entry/main-input"

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
      <Typography.Heading size="base" className="mb-3 font-semibold">
        Authorization
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-7">
        Login in to your account using the address {email}
      </Typography.Paragraph>
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
      </form>
    </div>
  )
}
