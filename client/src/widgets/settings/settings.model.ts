import { tabModelFactory } from "@/shared/ui/tab";
export enum TabsEnum {
	general,
	synchronization,
	theme
}

export const tabModel = tabModelFactory<TabsEnum>({defaultValue: TabsEnum.general})
