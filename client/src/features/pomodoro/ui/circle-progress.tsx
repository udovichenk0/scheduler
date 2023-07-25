import { clsx } from "clsx"

export const ProgressCircle = ({
  time, 
  timeLeft,
  circleStyle,
  progressStyle,
  textStyle 
}: {
  time: number, 
  timeLeft: number,
  circleStyle: string,
  progressStyle: string,
  textStyle: string
}) => {
  const minute = Math.floor(time / 60)
  const minutes = minute > 9 ? minute : `0${minute}`
  const seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`
  return (
      <div className="flex justify-center w-full h-full">
        <svg width="300" height="300" viewBox="-21.25 -31.25 312.5 312.5" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle r="125" cx="135" cy="135" className={circleStyle} fill="transparent"  strokeWidth="7px" strokeDasharray="2 7"></circle>
          <circle r="125" cx="135" cy="135" className={clsx("-rotate-90 translate-y-[270px]", progressStyle)} strokeWidth="8px" strokeDashoffset={timeLeft} fill="transparent" strokeDasharray="785"></circle>
          <text x="20%" y="49%" fontSize={60} className={textStyle} >
            {minutes}:{seconds}
          </text>
        </svg>
      </div>
  )
}