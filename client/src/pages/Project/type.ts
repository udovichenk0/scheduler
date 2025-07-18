import { ViewTypes } from "./config"

export type ViewType = (typeof ViewTypes)[keyof typeof ViewTypes]
