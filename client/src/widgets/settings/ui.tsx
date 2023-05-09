import { useState } from "react";
import { SettingSvg } from "./assets/settings.svg";
import { Synchronization } from "./assets/synchronization.svg";

const settingElements = [
	{ Icon: SettingSvg, title: 'General' },
	{ Icon: Synchronization, title: 'Synchronization' }
]

export const Settings = () => {
	const [active, setActive] = useState(0)
	console.log(active)
	return (
		<div>
			<div className="flex gap-5 border-b-[1px] border-white/10 px-6 pb-3">
				{settingElements.map((elem, id) => {
					return (
						<button key={id} onClick={() => setActive(id)}
							className={`flex ${active == id ? 'text-white fill-white' : 'fill-[#76899b] text-[#76899b]'}
											 ${active != id && 'hover:fill-white/60 hover:text-white/60'} flex-col gap-3 items-center`}>
							<elem.Icon />
							<span className="text-inherit">{elem.title}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}