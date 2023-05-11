import { ReactNode } from "react"

export function TabList({
	children,
	className
}:{
children: ReactNode,
className: string
}){
return (
	<ul className={className}>
		{children}
	</ul>
)
}