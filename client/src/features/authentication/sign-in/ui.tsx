import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Icon } from "@/shared/ui/icon/icon"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { $password, $passwordError, passwordChanged, submitTriggered } from "./signin.modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signin = ({showEmailForm}:{showEmailForm: () => void}) => {
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
  })
  return (
    <div className="relative text-center text-cFont">
      <span className="absolute left-[-20px]">
        <IconButton intent={'primary'} size={'m'} iconName="common/arrow" onClick={() => showEmailForm()}/>
      </span>
      <h2 className="text-lg mb-3 font-semibold">Authorization</h2>
      <p className="text-sm mb-7">Login in to your account using the address {email}</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={changePassword} 
          error={error} 
          focusRef={ref}
          value={password} 
          label="Password" 
          name="login"
          type={isPasswordShown ? 'text' : 'password'}
          icon={
            <div onClick={() => togglePasswortView(prev => !prev)} className="hover:stroke-white stroke-grey cursor-pointer">
              {isPasswordShown ? <Icon name="eye/close"/> : <Icon name="eye/open"/>}
            </div>
          }/>
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
  return <span>Incorrect login or password</span>
}