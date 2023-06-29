import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Icon } from "@/shared/ui/icon/icon"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { $password, $passwordError, passwordChanged, submitTriggered } from "./signup.modal"
const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
export const Signup = ({showEmailForm}:{showEmailForm: () => void}) => {
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
        <IconButton intent={'primary'} size={'m'} iconName="common/arrow" onClick={() => showEmailForm()}/>
      </span>
      <h2 className="text-lg mb-3 font-medium">Registration</h2>
      <p className="text-sm mb-7">Creating an account using the address {email}</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={changePassword} 
          error={error} 
          value={password} 
          label="Password" 
          focusRef={ref}
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
  const error = useUnit($passwordError)
  if(error == 'too_small'){
    return <span>Password should consist of 8 or more symbols</span>
  }
  return <span>Incorrect login or password</span>
}