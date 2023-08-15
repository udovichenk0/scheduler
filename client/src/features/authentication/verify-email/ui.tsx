import { useRef, useEffect, FormEvent } from "react"
import { useUnit } from "effector-react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/input"

import { $code, codeChanged, submitTriggered } from "./verify.model"

export const VerifyEmail = ({ goBack }: { goBack: () => void }) => {
  const [code, changeCode, submit] = useUnit([
    $code,
    codeChanged,
    submitTriggered
  ])
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current && ref.current.focus()
  }, [])
  return (
    <div className="relative text-center text-cFont">
      <Button
        className="absolute -top-1 -left-[20px]"
        onClick={goBack}
        intent={"primary"}
        size={"sm"}
      >
        <Icon
          name="common/arrow"
          className="text-4 rotate-180 text-cIconDefault"
        />
      </Button>
      <Typography.Heading size="base" className="mb-3 font-semibold">
        Verification
      </Typography.Heading>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => onSubmit(e)}
      >
        <Input
          onChange={(e) => changeCode(e.target.value)}
          ref={ref}
          className="mb-10"
          value={code}
          label="Confirmation code"
        />
        <span>
          <Button
            className={`${!code && "pointer-events-none bg-[#1f4964]"}`}
            disabled={!code}
            size={"m"}
            intent={"filled"}
          >
            Resume
          </Button>
        </span>
      </form>
    </div>
  )
}
