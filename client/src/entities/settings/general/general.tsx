import { useTranslation } from "react-i18next"
import { useUnit } from "effector-react"
import { useEffect, useRef } from "react"

import { onMount } from "@/shared/lib/react/on-mount.ts"

import { languages } from "./config"
import { $currentLanguage, init, languageChanged } from "./general.modal"
import { Selector } from "./ui/selector"
export const GeneralSettings = () => {
  const ref = useRef<HTMLButtonElement>(null)
  const onInit = useUnit(init)
  const { t } = useTranslation()
  onMount(onInit)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div className="mx-auto mb-6 w-[90%] space-y-3">
      <div className="flex items-center justify-end space-x-1">
        <span>{t("setting.general.lang")}:</span>
        <Selector
          ref={ref}
          $selectedValue={$currentLanguage}
          options={languages}
          onSelect={languageChanged}
        />
      </div>
    </div>
  )
}
