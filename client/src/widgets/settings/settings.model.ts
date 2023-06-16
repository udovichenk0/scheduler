import { createEvent, createStore, sample } from "effector";
import { TabsEnum } from "./config";

export const tabSelected = createEvent<TabsEnum>()

export const $activeTab = createStore<TabsEnum>(TabsEnum.general)

sample({
  clock: tabSelected,
  target: $activeTab
})

