import { useUnit } from "effector-react"
import { FormEvent, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Typography } from "@/shared/ui/general/typography"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/data-entry/main-input"

import { $email, $emailError, emailChanged, submitTriggered } from "./modal"

const onSubmit = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}

export const CheckEmailForm = ({ goBack }: { goBack: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)
  const [email, error, changeEmail, submit] = useUnit([
    $email,
    $emailError,
    emailChanged,
    submitTriggered,
  ])
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
          className="text-4 -rotate-90 text-cIconDefault"
        />
      </Button>
      <Typography.Heading size="base" className="mb-3 font-medium">
        {t("setting.synchronization.byEmail.title")}
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-7">
        {t("setting.synchronization.main.description")}
      </Typography.Paragraph>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => onSubmit(e, submit)}
      >
        <Input
          onChange={(e) => changeEmail(e.target.value)}
          error={error}
          autoFocus
          className="mb-10"
          ref={ref}
          value={email}
          label={t("setting.synchronization.byEmail.label")}
        />
        <span>
          <Button intent={"filled"} size={"m"} disabled={!email}>
            {t("setting.synchronization.byEmail.continueButtonTitle")}
          </Button>
        </span>
      </form>
    </div>
  )
}
