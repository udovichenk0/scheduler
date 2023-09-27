import { useEffect, useState, useRef } from "react"
import { Event, Store } from 'effector'
import { useUnit } from "effector-react"
type Options = {
  value: string,
  label: string
}[]
type SelectorProps = {
  $selectedValue: Store<string>,
  options: Options
  onSelect: Event<string>
}
export const Selector = ({
  $selectedValue,
  options,
  onSelect
}: SelectorProps) => {
  const { selectedValue } = useUnit({selectedValue: $selectedValue})
  const [isShown, setIsShown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const clickOutside = (e: MouseEvent) => {
    if(ref.current && !ref.current.contains(e.target as Node)) {
      setIsShown(false)
    }
  }
  useEffect(() => {
    if(isShown){
      document.addEventListener('mouseup', clickOutside)
    }
    return () => {
      document.removeEventListener('mouseup', clickOutside)
    }
  }, [isShown])
  return (
    <div ref={ref} className="relative w-[150px]">
      <button 
        onClick={() => setIsShown(prev => !prev)} 
        className="w-full h-[24px] rounded-[5px] px-4 text-center border border-cSecondBorder">
        {selectedValue}
      </button>
      {isShown && (
        <div className="absolute w-full bg-main border border-cSecondBorder top-[23px]">
            { options.map(({ value, label }) => {
              return (
                <button onClick={() => onSelect(value)} key={label} className={`text-cOpacitySecondFont hover:text-white hover:bg-blue-500 w-full px-4 
                  ${label === selectedValue && 'bg-cHover'}`}>
                  {label}
                </button>
              )
            })
            }
        </div>
      )}
    </div>
  )
}