import { useUnit } from "effector-react";
import { Button } from "@/shared/ui/buttons/main-button";
import { Icon } from "@/shared/ui/icon";
import { FormEnum, setFormTriggered } from "./sync.modal";

export function LoginOptions(){
  const [
    setForm
  ] = useUnit([
    setFormTriggered
  ])
  return (
    <div className="text-center text-cFont">
      <h2 className="text-lg mb-2 font-semibold">Welcome to Scheduler App</h2>
      <p className="text-sm mb-6">Log in to access your your account and sync the data between devices</p>
      <div className="inline-flex flex-col gap-5 text-">
        <Button onClick={() => setForm(FormEnum.email)} icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Email" size={'lg'} />
        <Button icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Google" size={'lg'} />
        <Button icon={<Icon name="common/mail" className="text-primary w-[15px]" />} title="Continue with Apple" size={'lg'} />
      </div>
    </div>
  )
}