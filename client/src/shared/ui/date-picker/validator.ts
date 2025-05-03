export function validateMin(min: string) {
  const numericMin = Number(min);
  return !isNaN(numericMin) && numericMin >= 0 && numericMin < 60 ? numericMin : 0;
}

export function validateHour(hour: string, ampm?: string) {
  const numHour = Number(hour);
  if (numHour >= 0 && numHour < 12) {
    return ampm === "pm" ? numHour + 12 : numHour;
  } else if (numHour >= 12 && numHour < 23) {
    return ampm === "am" ? numHour % 12 : numHour;
  }
  return 0;
}

export function validateAmPm(ampm?: string) {
  if (!ampm) return
  ampm = ampm.toLowerCase().slice(0, 2)

  if ("am".startsWith(ampm)) return "am"
  if ("pm".startsWith(ampm)) return "pm"
}

