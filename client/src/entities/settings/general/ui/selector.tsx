import { useEffect, useState, useRef, Ref } from "react"
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
  ref: Ref<HTMLButtonElement>
}
export const Selector = ({
  $selectedValue,
  options,
  onSelect,
  ref: focusRef,
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
        ref={focusRef}
        onClick={() => setIsShown((prev) => !prev)}
        className="border-cSecondBorder h-[24px] w-full rounded-[5px] border px-4 text-center focus-visible:ring"
      >
        {selectedValue}
      </button>
      {isShown && (
        <div className="border-cSecondBorder bg-main absolute top-[23px] w-full border">
          {options.map(({ value, label }) => {
            return (
              <button
                onClick={() => onSelect(value)}
                key={label}
                className={`text-cOpacitySecondFont w-full px-4 hover:bg-blue-500 hover:text-white 
                  ${label === selectedValue && "bg-hover"}`}
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
