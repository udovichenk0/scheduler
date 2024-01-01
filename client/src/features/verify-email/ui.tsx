import { useRef } from "react"
import { useUnit, useGate } from "effector-react"
import { useTranslation } from "react-i18next"

import { CodeInput } from "@/shared/ui/data-entry/code-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"
import { Button } from "@/shared/ui/buttons/main-button"

import { $code, $isRunning, $time, CODE_LENGTH, FormGate, codeChanged, resent, submitTriggered } from "./verify.model"

export const VerifyEmail = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)

  const code = useUnit($code)
  const isRunning = useUnit($isRunning)
  const time = useUnit($time)

  const changeCode = useUnit(codeChanged)
  const onSubmit = useUnit(submitTriggered)
  const onResend = useUnit(resent)
  useGate(FormGate)
  const isDisabled = code?.length != CODE_LENGTH
  useGate
  return (
    <AuthTemplate
      title={t("setting.synchronization.verify.title")}
      subtitle={t("setting.synchronization.verify.description")}
      onArrowClick={goBack}
      onSubmit={onSubmit}
    >
      <div className="flex justify-center mb-4">
        <CodeInput
          label={t("setting.synchronization.verify.label")}
          inputStyle="focus:border-cHover bg-transparent border-b p-1 mx-0 w-6 border-cSecondBorder"
          containerStyle="gap-2"
          length={CODE_LENGTH}
          value={code}
          onChange={(e) => changeCode(e)}
          ref={ref}
        />
      </div>
      <div className="flex justify-end gap-5 items-center">
        <span>Try again in {time}s.</span>
        <span>
          <Button 
            type="button"
            disabled={isRunning}
            className={`${isRunning && 'opacity-50'}`}
            intent={'outline'}
            size={'m'}
            onClick={onResend}>
              Resend
          </Button>
        </span>
        <span>
          <Button 
            disabled={isDisabled}
            className={`${isDisabled && 'opacity-50'}`}
            intent={'filled'} 
            size={'m'}>
            Submit
          </Button>
        </span>
      </div>
    </AuthTemplate>
  )
}
