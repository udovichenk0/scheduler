import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef } from "react"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/input"
import { $email, $emailError, emailChanged, submitTriggered } from "./modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}

export const CheckEmailForm = ({ goBack }: { goBack: () => void }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [email, error, changeEmail, submit] = useUnit([
    $email,
    $emailError,
    emailChanged,
    submitTriggered,
  ])
  useEffect(() => {
    ref.current && ref.current.focus()
  }, [])
  return (
    <div className="relative text-center text-cFont">
      <Button
        className="absolute -left-[20px]"
        onClick={goBack}
        intent={"primary"}
        size={"sm"}
      >
        <Icon
          name="common/arrow"
          className="text-4 rotate-180 text-cIconDefault"
        />
      </Button>
      <h2 className="mb-3 text-lg font-medium">Log in by email</h2>
      <p className="mb-7 text-sm">
        Specify the address to log in to your account or register
      </p>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => onSubmit(e, submit)}
      >
        <Input
          onChange={(e) => changeEmail(e.target.value)}
          error={error}
          className="mb-10"
          ref={ref}
          value={email}
          label="Email"
        />
        <span>
          <Button intent={"filled"} size={"m"} disabled={!email}>
            Continue
          </Button>
        </span>
      </form>
    </div>
  )
}
