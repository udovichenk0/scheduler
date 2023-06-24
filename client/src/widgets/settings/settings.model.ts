import { sample } from "effector";
import { createGate } from "effector-react/effector-react.mjs";
import { tabModelFactory } from "@/shared/ui/tab";
export enum TabsEnum {
	general,
	synchronization,
	theme
}

export const gate = createGate()
export const tabModel = tabModelFactory<TabsEnum>({defaultValue: TabsEnum.general})

sample({
  clock: gate.close,
  target: tabModel.reset
})
