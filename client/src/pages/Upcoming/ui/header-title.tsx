import { Dayjs } from "dayjs"

import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"

export const HeaderTitle = ({ variant }: { variant: "upcoming" | Dayjs }) => {
  if (variant == "upcoming") {
    return <span>Upcoming</span>
  }
  return (
    <>
      <span className="text-cIconDefault">
        {LONG_WEEKS_NAMES[variant.day()]}&nbsp;
      </span>
      <span>
        {variant.date()}&nbsp;
        {lowerCase(LONG_MONTHS_NAMES[variant.month()])}&nbsp;
      </span>
      <span className="text-cIconDefault">{variant.year()}</span>
    </>
  )
}

function lowerCase(word: string) {
  return word.slice(0, 1).toLowerCase() + word.slice(1)
}
