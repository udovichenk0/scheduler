import { useUnit } from "effector-react"
import { useEffect } from "react"
import { Arrow } from "@/shared/ui/arrow"
import { DisableButton } from "@/shared/ui/buttons/disable-button"
import { HoverIconButton } from "@/shared/ui/buttons/hover-icon-button"
import { Input } from "@/shared/ui/input"
import { $email, $emailError, emailChanged, onSubmit, resetTriggered } from "./modal"

export const ByEmailForm = ({showEmailForm}:{showEmailForm: (v: boolean) => void}) => {
    const email = useUnit($email)
    const error = useUnit($emailError)
    useEffect(() => {
        return () => resetTriggered()
    }, [])
    return (
        <div className="relative">
            <span className="absolute left-[-20px]">
                <HoverIconButton icon={<Arrow/>} action={() => showEmailForm(false)}/>
            </span>
            <h2 className="text-lg mb-3 font-semibold">Log in by email</h2>
            <p className="text-sm mb-7">Specify the address to log in to your account or register</p>
            <form className="flex w-full flex-col" onSubmit={(e) => onSubmit(e)}>
                <Input onChange={emailChanged} error={error} value={email} label="Email" name=""/>
                <div className="h-[40px] text-sm text-error mt-1">
                    {error && <EmailValidationError/>}
                </div>
                <span>
                    <DisableButton action={onSubmit} disabled={!email}/>
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