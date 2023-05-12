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
		<div className="px-6 py-3" hidden={activeValue != label}>
			{activeValue == label && children}
		</div>
	)
}