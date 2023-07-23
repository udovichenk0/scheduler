import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"
import { $password, $passwordError, passwordChanged, submitTriggered } from "./signup.modal"
const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signup = ({goBack}:{goBack: () => void}) => {
  const [
    password, 
    error, 
    email,
    changePassword,
    submit
  ] = useUnit([
    $password, 
    $passwordError, 
    $email,
    passwordChanged, 
    submitTriggered
  ])
  const [isPasswordShown, togglePasswortView] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current && ref.current.focus()
  }, [])
  return (
    <div className="relative text-center text-cFont">
      <span className="absolute left-[-20px]">
      <IconButton className="rotate-180" intent={'primary'} size={'m'} iconName="common/arrow" onClick={() => goBack()}/>
      </span>
      <h2 className="text-lg mb-3 font-medium">Registration</h2>
      <p className="text-sm mb-7">Creating an account using the address {email}</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={(e) => changePassword(e.target.value)} 
          error={error} 
          value={password} 
          label="Password"
          className="mb-10"
          ref={ref}
          type={isPasswordShown ? 'text' : 'password'}
          icon={<TogglePasswordButton isPasswordVisible={isPasswordShown} togglePasswordVisibility={togglePasswortView}/>}/>
        <span>
          <DisableButton disabled={!password}/>
        </span>
      </form>
    </div>
  )
}