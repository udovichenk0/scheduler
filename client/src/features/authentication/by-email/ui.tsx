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

export const CheckEmailForm = ({goBack}:{goBack: () => void}) => {
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
  }, [])
  return (
    <div className="relative text-center text-cFont">
      <span className="absolute left-[-20px]">
      <IconButton className="rotate-180" size={'m'} iconName="common/arrow" intent={'primary'} onClick={() => goBack()}/>
      </span>
      <h2 className="text-lg mb-3 font-medium">Log in by email</h2>
      <p className="text-sm mb-7">Specify the address to log in to your account or register</p>
      <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e, submit)}>
        <Input 
          onChange={(e) => changeEmail(e.target.value)} 
          error={error}
          className="mb-10"
          ref={ref} 
          value={email}
          label="Email" 
         />
        <span>
          <Button intent={'filled'} size={'m'} disabled={!email}>
            Continue
          </Button>
        </span>
      </form>
    </div>
  )
}