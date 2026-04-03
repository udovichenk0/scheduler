import { View } from "./config"

export type ViewType = (typeof View)[keyof typeof View]
