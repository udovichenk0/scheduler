import { useEffect, useState, useRef } from "react"
import { EventCallable, Store } from "effector"
import { useUnit } from "effector-react"
type Options = {
  value: string
  label: string
}[]
type SelectorProps = {
  $selectedValue: Store<string>
  options: Options
  onSelect: EventCallable<string>
}
export const Selector = ({
  $selectedValue,
  options,
  onSelect,
}: SelectorProps) => {
  const { selectedValue } = useUnit({ selectedValue: $selectedValue })
  const [isShown, setIsShown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const clickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsShown(false)
    }
  }
  useEffect(() => {
    if (isShown) {
      document.addEventListener("mouseup", clickOutside)
    }
    return () => {
      document.removeEventListener("mouseup", clickOutside)
    }
  }, [isShown])
  return (
    <div ref={ref} className="relative w-[150px]">
      <button
        onClick={() => setIsShown((prev) => !prev)}
        className="h-[24px] w-full rounded-[5px] border border-cSecondBorder px-4 text-center"
      >
        {selectedValue}
      </button>
      {isShown && (
        <div className="absolute top-[23px] w-full border border-cSecondBorder bg-main">
          {options.map(({ value, label }) => {
            return (
              <button
                onClick={() => onSelect(value)}
                key={label}
                className={`w-full px-4 text-cOpacitySecondFont hover:bg-blue-500 hover:text-white 
                  ${label === selectedValue && "bg-cHover"}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
