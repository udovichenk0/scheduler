import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef } from "react"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/input"
import { $email, $emailError, emailChanged, submitTriggered } from "./modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}

export const ByEmailForm = ({showEmailForm}:{showEmailForm: () => void}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [
    email, 
    error,
    changeEmail,
    submit
  ] = useUnit([
    $email, 
    $emailError, 
    emailChanged, 
    submitTriggered
  ])
  useEffect(() => {
    ref.current && ref.current.focus()
  })
  return (
    <div className="relative text-center text-cFont">
      <span className="absolute left-[-20px]">
        <IconButton size={'m'} iconName="common/arrow" intent={'primary'} onClick={() => showEmailForm()}/>
      </span>
      <h2 className="text-lg mb-3 font-medium">Log in by email</h2>
      <p className="text-sm mb-7">Specify the address to log in to your account or register</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={changeEmail} 
          error={error}
          focusRef={ref} 
          value={email} 
          label="Email" 
          name="email"/>
        <div className="h-[40px] text-sm text-error mt-1">
          {error && <EmailValidationError/>}
        </div>
        <span>
          <Button intent={'filled'} size={'m'} onSubmit={() => console.log('something')} title="Resume" disabled={!email}/>
        </span>
      </form>
    </div>
  )
}

function EmailValidationError(){
  const error = useUnit($emailError)
  if(error === 'too_small') {
    return <span>Entered email is too short</span>
  }
  if(error === 'invalid_string'){
    return <span>Entered email is not valid</span>
  }
  else {
    return <span>Entered email is not correct</span>
  }
}