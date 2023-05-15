import { useUnit } from "effector-react"
import { FormEvent, useState } from "react"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { HoverIconButton } from "@/shared/ui/buttons/hover-icon-button"
import { Arrow, HideEye, EyeSvg } from "@/shared/ui/icons"
import { Input } from "@/shared/ui/input"
import { $login, $loginError, loginChanged } from "./signin.modal"
const onSubmit = (e: FormEvent) => {
    return e
}
export const Signin = ({showLoginForm}:{showLoginForm: () => void}) => {
    const [login, error] = useUnit([$login, $loginError])
    const [isPasswordShown, togglePasswortView] = useState(false)
    return (
        <div className="relative">
        <span className="absolute left-[-20px]">
            <HoverIconButton icon={<Arrow/>} action={() => showLoginForm()}/>
        </span>
        <h2 className="text-lg mb-3 font-semibold">Authorization</h2>
        <p className="text-sm mb-7">Login in to your account using the address ...</p>
        <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e)}>
            <Input 
            onChange={loginChanged} 
            error={error} 
            value={login} 
            label="Login" 
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
                <DisableButton action={onSubmit} disabled={!login}/>
            </span>
        </form>
    </div>
    )
}


function LoginValidationError(){
    return <span>Incorrect password</span>
}