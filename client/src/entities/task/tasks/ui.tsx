import dayjs from "dayjs"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Task } from "./type"

export const TaskItem = ({
  data,
  onChange, 
  onDoubleClick,
  date = false
}: {
    data: Task 
    onChange: () => void, 
    onDoubleClick: () => void,
    date?: boolean
}) => {
  const { title, status, start_date } = data
  return (
    <button onDoubleClick={onDoubleClick} className="select-none focus:bg-cFocus text-primary cursor-default flex items-center w-full hover:bg-cHover rounded-[5px] px-2 py-2">
      <Checkbox onChange={onChange} status={status}/>
      <div className="flex items-center">
        {date && start_date && (
          <span className={`ml-2 text-[12px] rounded-[5px] px-[5px] py-[1px] ${dayjs(start_date).isSameOrAfter(dayjs()) ? 'bg-cTimeInterval' : 'bg-cTimeIntervalLow'}`}>
            {normilizeDate(start_date)}
          </span>
        )}

        <label 
          htmlFor="default-checkbox" 
          className={`ml-2 text-sm font-medium ${status == 'FINISHED' && 'line-through text-grey'}`}>
          {title}
        </label>
      </div>
    </button>
  )
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


function normilizeDate(date: Date){
  const dayjsDate = dayjs(date)
  if(dayjsDate.year() == dayjs().year()){
    return `${months[dayjsDate.month()]} ${dayjsDate.date()}`
  }
  else {
    return `${dayjsDate.year()} ${months[dayjsDate.month()]} ${dayjsDate.date()}`
  }
}