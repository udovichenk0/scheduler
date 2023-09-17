import { useRef } from "react"
import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { CodeInput } from "@/shared/ui/data-entry/code-input"
import { AuthTemplate } from "@/shared/ui/templates/auth/ui"

import { $code, codeChanged, submitTriggered } from "./verify.model"

export const VerifyEmail = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)
  const [code, changeCode, onSubmit] = useUnit([
    $code,
    codeChanged,
    submitTriggered,
  ])
  return (
    <AuthTemplate
      title={t("setting.synchronization.verify.title")}
      subtitle={t("setting.synchronization.verify.description")}
      onArrowClick={goBack}
      onSubmit={onSubmit}
      className="flex justify-center"
    >
      <CodeInput
        label={t("setting.synchronization.verify.label")}
        inputStyle="focus:border-cHover bg-transparent border-b p-1 mx-0 w-6 border-cSecondBorder"
        containerStyle="gap-2"
        length={6}
        value={code}
        onChange={(e) => changeCode(e)}
        ref={ref}
      />
    </AuthTemplate>
  )
}
