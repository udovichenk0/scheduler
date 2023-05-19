import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { HoverIconButton } from "@/shared/ui/buttons/hover-icon-button"
import { Arrow, HideEye, EyeSvg } from "@/shared/ui/icons"
import { Input } from "@/shared/ui/input"
import { $email } from "../by-email"
import { $password, $passwordError, passwordChanged, submitTriggered } from "./signup.modal"
const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitTriggered()
}
export const Signup = ({showEmailForm}:{showEmailForm: () => void}) => {
    const [password, error, email] = useUnit([$password, $passwordError, $email])
    const [isPasswordShown, togglePasswortView] = useState(false)
    const ref = useRef<HTMLInputElement>(null)
    useEffect(() => {
        ref.current && ref.current.focus()
    })
    return (
        <div className="relative">
        <span className="absolute left-[-20px]">
            <HoverIconButton icon={<Arrow/>} action={() => showEmailForm()}/>
        </span>
        <h2 className="text-lg mb-3 font-medium">Registration</h2>
        <p className="text-sm mb-7">Creating an account using the address {email}</p>
        <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e)}>
            <Input 
            onChange={passwordChanged} 
            error={error} 
            value={password} 
            label="Password" 
            focusRef={ref}
            name="login"
            type={isPasswordShown ? 'text' : 'password'}
            icon={
            <div onClick={() => togglePasswortView(prev => !prev)} className="hover:stroke-white stroke-grey cursor-pointer">
                {isPasswordShown ? <HideEye/> : <EyeSvg/>}
            </div>
            }/>
            <div className="h-[40px] text-sm text-error mt-1">
                {error && <LoginValidationError/>}
            </div>
            <span>
                <DisableButton action={onSubmit} disabled={!password}/>
            </span>
        </form>
    </div>
    )
}


function LoginValidationError(){
    return <span>Incorrect password</span>
}