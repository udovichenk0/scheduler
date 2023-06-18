import { tabModelFactory } from "@/shared/ui/tab";
export enum TabsEnum {
	general,
	synchronization
}

export const tabModel = tabModelFactory<TabsEnum>({defaultValue: TabsEnum.general})
