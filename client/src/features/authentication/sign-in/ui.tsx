import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { TogglePasswordButton } from "../shared/ui/toggle-password-button"
import { NOT_VALID_MESSAGE, TOO_LONG_MESSAGE } from "./constants"
import { $password, $passwordError, passwordChanged, submitTriggered } from "./signin.modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signin = ({goBack}:{goBack: () => void}) => {
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
      <h2 className="text-lg mb-3 font-semibold">Authorization</h2>
      <p className="text-sm mb-7">Login in to your account using the address {email}</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={(e) => changePassword(e.target.value)} 
          error={error} 
          ref={ref}
          value={password} 
          label="Password" 
          type={isPasswordShown ? 'text' : 'password'}
          icon={<TogglePasswordButton isPasswordVisible={isPasswordShown} togglePasswordVisibility={togglePasswortView}/>}/>
        <div className="h-[40px] text-sm text-error mt-1">
          {error && <LoginValidationError/>}
        </div>
        <span>
          <DisableButton disabled={!password}/>
        </span>
      </form>
    </div>
  )
}


function LoginValidationError(){
  const error = useUnit($passwordError)
  if(error === 'too_long'){
    return <span>{TOO_LONG_MESSAGE}</span>
  }
  return <span>{NOT_VALID_MESSAGE}</span>
}