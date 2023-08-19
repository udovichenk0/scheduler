const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fra", "Sat", "Sun"]
export const WeekNames = () => {
  return (
    <div className="flex justify-around border-t border-r border-cBorder text-primary">
      {daysOfTheWeek.map((week) => {
        return <span key={week}>{week}</span>
      })}
    </div>
  )
}
