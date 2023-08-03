import { useUnit } from "effector-react"
import { FormEvent, useEffect, useRef } from "react"
import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
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
      <Typography.Heading size="base" className="mb-3 font-medium">
        Log in by email
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-7">
        Specify the address to log in to your account or register
      </Typography.Paragraph>
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
