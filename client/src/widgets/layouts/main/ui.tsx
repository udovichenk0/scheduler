import { PropsWithChildren } from "react"
/* eslint-disable boundaries/element-types */
import { Header } from '@/widgets/header'
import { Sidebar } from "@/widgets/sidebar/ui"
export const MainLayout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<div className="flex">
				<Sidebar />
				<div className="w-full h-screen">
					<Header />
					{children}
				</div>
			</div>
		</div>
	)
}