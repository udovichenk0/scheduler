import { clsx } from "clsx";
import { ReactNode, useContext } from "react";
import { TabContext } from ".";

interface TabProps {
	value: string,
	className?: string,
  activeClass?: string,
  children: ReactNode
}

//fix it
export function Trigger({className, value, activeClass, children, ...props }:TabProps){
  const {value: currentValue, setValue} = useContext(TabContext)
  return (
    <button {...props} onClick={() => setValue(value)} 
      className={clsx(className, currentValue == value && activeClass)}>
      {children}
    </button>
  )
}