import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useUnit } from 'effector-react'

import { languages } from "./config"
import { $currentLanguage, init, languageChanged } from "./general.modal"
import { Selector } from "./ui/selector"
export const GeneralSettings = () => {
  const onInit = useUnit(init)
  const { t } = useTranslation()
  useEffect(() => {
    onInit()
  }, [])
  return (
    <div className="mx-auto mb-6 w-[90%] space-y-3">
      <div className="flex items-center justify-end space-x-1">
        <span>{t("setting.general.lang")}:</span>
        <Selector
          $selectedValue={$currentLanguage}
          options={languages}
          onSelect={languageChanged}
        />
      </div>
    </div>
  )
}
