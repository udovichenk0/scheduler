import { useRef, FormEvent } from "react"
import { useUnit } from "effector-react"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"
import { CodeInput } from "@/shared/ui/data-entry/code-input"

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
        className="flex justify-center"
        onSubmit={(e) => onSubmit(e)}
      >
        <CodeInput 
          inputStyle="focus:border-cHover bg-transparent border-b p-1 mx-0 w-6 border-cSecondBorder"
          containerStyle="gap-2 py-5"
          length={6} 
          value={code} 
          onChange={(e) => changeCode(e)} 
          ref={ref}/>
      </form>
    </div>
  )
}

