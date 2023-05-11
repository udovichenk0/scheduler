import { ReactNode } from "react"

export function TabPanel({
	activeValue,
	label,
	children
}:{
	activeValue: number,
	label: number,
	children: ReactNode
}){
	return (
		<li hidden={activeValue != label}>
			{activeValue == label && children}
		</li>
	)
}