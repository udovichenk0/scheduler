import { useTranslation } from "react-i18next"

import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"

export const WeeksName = () => {
  const { t } = useTranslation()
  return (
    <div className="text-primary flex justify-around">
      {SHORT_WEEKS_NAMES.map((name) => {
        return (
          <span className="justify-self-center py-2 text-[12px]" key={name}>
            {t(name)}
          </span>
        )
      })}
    </div>
  )
}
