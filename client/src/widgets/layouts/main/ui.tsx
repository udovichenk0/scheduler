import { Sidebar } from "@/widgets/sidebar/ui"
import { PropsWithChildren } from "react"
import { Header } from '@/widgets/header'
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