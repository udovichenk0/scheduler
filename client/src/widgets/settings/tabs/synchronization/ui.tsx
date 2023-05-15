import { useUnit } from "effector-react/effector-react.mjs"
import { useEffect } from "react"
import { ByEmailForm, Signin, Signup } from "@/features/authentication"
import { Button } from "@/shared/ui/buttons/main-button"
import { MailSvg } from "../assets"
import { $formToShow, Form, resetFormTriggered, setFormTriggered } from "./sync.modal"



export const SynchronizationTab = () => {
    const formToShow = useUnit($formToShow)
    useEffect(() => {
        return () => {
            resetFormTriggered()
        }
    }, [])
    return (
        <div className="flex flex-col items-center">
            <div className="text-center w-[391px]">
                {formToShow === Form.options && <LoginOptions onClick={() => setFormTriggered(Form.email)}/>}
                {formToShow === Form.email && <ByEmailForm showEmailForm={() => setFormTriggered(Form.options)}/>}
                {formToShow === Form.login && <Signin showLoginForm={() => setFormTriggered(Form.login)}/>}
                {formToShow === Form.register && <Signup/>}
            </div>
        </div>
    )
}


function LoginOptions({onClick}:{onClick: () => void}){
    return (
        <>
            <h2 className="text-lg mb-2 font-semibold">Welcome to Scheduler App</h2>
            <p className="text-sm mb-6">Log in to access your your account and sync the data between devices</p>
            <div className="inline-flex flex-col gap-5">
                <Button onClick={() => onClick()} icon={<MailSvg />} title="Continue with Email" size={'large'} />
                <Button icon={<MailSvg />} title="Continue with Google" size={'large'} />
                <Button icon={<MailSvg />} title="Continue with Apple" size={'large'} />
            </div>
        </>
    )
}
