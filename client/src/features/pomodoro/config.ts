export const setCustomDuration = ({
  defaultDurations,
  customDuration,
}: {
  defaultDurations: { time: number }[]
  customDuration: number
}) => {
  const customDurationMatchDefault = defaultDurations.find(
    (item) => item.time === customDuration,
  )
  if (customDurationMatchDefault) {
    return defaultDurations
  }
  return [...defaultDurations, { time: customDuration, custom: true }].sort(
    (a, b) => a.time - b.time,
  )
}
