import { useRef } from "react"
import { useUnit } from "effector-react"

import { CodeInput } from "@/shared/ui/data-entry/code-input"
import { AuthTemplate } from "@/shared/ui/templates/auth/ui"

import { $code, codeChanged, submitTriggered } from "./verify.model"

export const VerifyEmail = ({ goBack }: { goBack: () => void }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [code, changeCode, onSubmit] = useUnit([
    $code,
    codeChanged,
    submitTriggered,
  ])
  return (
    <AuthTemplate
      title="Verification"
      subtitle="Enter the verification code to authenticate your account"
      onArrowClick={goBack}
      onSubmit={onSubmit}
      className="flex justify-center"
    >
      <CodeInput
        inputStyle="focus:border-cHover bg-transparent border-b p-1 mx-0 w-6 border-cSecondBorder"
        containerStyle="gap-2 py-5"
        length={6}
        value={code}
        onChange={(e) => changeCode(e)}
        ref={ref}
      />
    </AuthTemplate>
  )
}
