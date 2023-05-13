import { useUnit } from "effector-react"
import { Button } from "@/shared/ui/buttons/main-button"
import { Input } from "@/shared/ui/input"
import { $email, emailChanged } from "./modal"

export const ByEmailForm = () => {
    const email = useUnit($email)
    return (
        <div>
            <h2 className="text-lg mb-3 font-semibold">Log in by email</h2>
            <p className="text-sm mb-7">Specify the address to log in to your account or register</p>
            <form className="flex w-full flex-col gap-8">
                <Input onChange={emailChanged} value={email} label="Email" name=""/>
                <span>
                    <Button intent={'blue-filled'} size={'medium'} title="Resume"/>
                </span>
            </form>
        </div>
    )
}