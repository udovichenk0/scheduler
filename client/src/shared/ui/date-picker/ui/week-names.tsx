const daysName = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
export const WeeksName = () => {
  return (
    <div className="flex justify-around border-b-[1px] border-cBorder text-primary">
      {daysName.map((name) => {
        return (
          <span className="justify-self-center py-2 text-[12px]" key={name}>
            {name}
          </span>
        )
      })}
    </div>
  )
}
