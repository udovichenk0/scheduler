import { useRef } from "react"
import { useUnit, useGate } from "effector-react"
import { useTranslation } from "react-i18next"
import { StoreWritable } from "effector"

import { CodeInput } from "@/shared/ui/data-entry/code-input"
import { AuthTemplate } from "@/shared/ui/templates/auth"
import { Button } from "@/shared/ui/buttons/main-button"

import {
  $code,
  $error,
  $isRunning,
  $time,
  CODE_LENGTH,
  FormGate,
  codeChanged,
  resent,
  submitTriggered,
} from "./verify.model"

export const VerifyEmail = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)

  const code = useUnit($code)
  const isRunning = useUnit($isRunning)
  const error = useUnit($error)

  const changeCode = useUnit(codeChanged)
  const onSubmit = useUnit(submitTriggered)
  const onResend = useUnit(resent)
  useGate(FormGate)
  const isDisabled = code?.length != CODE_LENGTH
  return (
    <AuthTemplate
      title={t("setting.synchronization.verify.title")}
      subtitle={t("setting.synchronization.verify.description")}
      onArrowClick={goBack}
      onSubmit={onSubmit}
    >
      <div className="mb-2 flex justify-center">
        <CodeInput
          label={t("setting.synchronization.verify.label")}
          inputStyle={`focus:border-hover bg-transparent border-b p-[4px] mx-0 w-6 border-cSecondBorder ${
            error && "border-error"
          }`}
          containerStyle="gap-2"
          length={CODE_LENGTH}
          value={code}
          onChange={(e) => changeCode(e)}
          ref={ref}
        />
      </div>
      <Error error={error} />
      <div className="flex items-center justify-end gap-5 pt-5">
        <ResendTimer $time={$time} />
        <span>
          <Button
            type="button"
            disabled={isRunning}
            className={`${isRunning && "opacity-50"}`}
            intent={"outline"}
            size={"m"}
            onClick={onResend}
          >
            Resend
          </Button>
        </span>
        <span>
          <Button
            disabled={isDisabled}
            className={`${isDisabled && "opacity-50"}`}
            intent={"filled"}
            size={"m"}
          >
            Submit
          </Button>
        </span>
      </div>
    </AuthTemplate>
  )
}

const Error = ({ error }: { error: Nullable<string> }) => {
  return (
    <div className="h-5">
      {error && <div className="text-sm text-error">{error}</div>}
    </div>
  )
}

const ResendTimer = ({ $time }: { $time: StoreWritable<number> }) => {
  const time = useUnit($time)
  return <span>Try again in {time}s.</span>
}
