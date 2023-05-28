import { ReactNode } from "react"

export const Header = ({icon, title}:{icon: ReactNode, title: string}) => {
	return (
		<div className="mb-5 px-4">
			<div className="py-2">
			Header
			</div>
			<div className="flex gap-4 items-center">
				{icon}
				<h1 className="text-[24px]">{title}</h1>
			</div>
		</div>
	)
}