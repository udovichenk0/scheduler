import { addLeadingZero } from "../add-leading-zero"

export const normalizeSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const minuteWithLeadingZero = addLeadingZero(minutes)
  const secondsWithLeadingZero = addLeadingZero(remainingSeconds)
  return `${minuteWithLeadingZero}:${secondsWithLeadingZero}`
}
