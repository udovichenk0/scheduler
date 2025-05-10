import dayjs from "dayjs"

export const getToday = () => {
  return dayjs().startOf("date")
}

export const getTomorrow = () => {
  return dayjs().add(1, "day").startOf("date")
}

export const getLater = () => {
  return dayjs().add(2, "hour")
}

export const getNextWeek = () => {
  return dayjs().add(1, "week").set("day", 1)
}

export const getNextWeekend = () => {
  return dayjs().add(1, "week").weekday(7)
}

export const getSunday = () => {
  const day = dayjs().day()
  if(day >= 0){
    return dayjs().weekday(7)
  }
  return dayjs().weekday(0)
};
export const getMonday = () => {
  const day = dayjs().day()
  if(day >= 1){
    return dayjs().weekday(8)
  }
  return dayjs().weekday(1)
};
export const getTuesday = () => {
  const day = dayjs().day()
  if(day >= 2){
    return dayjs().weekday(9)
  }
  return dayjs().weekday(2)
};
export const getWednesday = () => {
  const day = dayjs().day()
  if(day >= 3){
    return dayjs().weekday(10)
  }
  return dayjs().weekday(3)
};
export const getThursday = () => {
  const day = dayjs().day()
  if(day >= 4){
    return dayjs().weekday(11)
  }
  return dayjs().weekday(4)
};
export const getFriday = () => {
  const day = dayjs().day()
  if(day >= 5){
    return dayjs().weekday(12)
  }
  return dayjs().weekday(5)
};
export const getSaturday = () => {
  const day = dayjs().day()
  if(day >= 6){
    return dayjs().weekday(13)
  }
  return dayjs().weekday(6)
};