import { ButtonHTMLAttributes, ReactNode } from "react";

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode,
	label: number,
	className?: string,
}

export function Tab({children,label,...props}:TabProps){
  return (
    <button {...props} onClick={props.onClick} className={props.className}>{children}</button>
  )
}