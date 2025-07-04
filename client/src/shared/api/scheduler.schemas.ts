/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Swagger Scheduler
 * OpenAPI spec version: 1.0.0
 */
/**
 * @nullable
 */
export type Description = string | null

/**
 * @nullable
 */
export type StartDate = number | null

/**
 * @nullable
 */
export type DueDate = number | null

/**
 * Email address
 * @minLength 4
 */
export type Email = string

/**
 * @minLength 6
 * @maxLength 6
 */
export type Code = string

export type Id = string

export interface UserDto {
  id: Id
  email: Email
  verified: boolean
}

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const TaskStatus = {
  inprogress: "inprogress",
  finished: "finished",
} as const

export type TaskType = (typeof TaskType)[keyof typeof TaskType]

export const TaskType = {
  inbox: "inbox",
  unplaced: "unplaced",
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export const Priority = {
  none: "none",
  low: "low",
  normal: "normal",
  high: "high",
  urgent: "urgent",
} as const

export interface TaskFields {
  title: string
  /** @nullable */
  description: string | null
  status: TaskStatus
  priority: Priority
  /** @nullable */
  start_date: number | null
  /** @nullable */
  due_date: number | null
  type: TaskType
}

export interface TaskDto {
  id: Id
  title: string
  /** @nullable */
  description: string | null
  status: TaskStatus
  /** @nullable */
  start_date: number | null
  /** @nullable */
  due_date: number | null
  user_id: Id
  type: TaskType
  date_created: string
  is_trashed: boolean
  priority: Priority
}

export type GetEmailExists200Response = {
  exists: boolean
}

/**
 * User response
 */
export type UserResponse = UserDto

export type AuthEmailCredsBody = {
  email: Email
  password: string
}

export type GetEmailExistsParams = {
  email: Email
}

export type PostAuthVerifyBody = {
  code: Code
  userId: Id
}

export type PostAuthResendBody = {
  email: Email
  userId: Id
}

export type PatchTasksIdDateBody = {
  start_date: StartDate
  due_date: DueDate
}

export type PatchTasksIdStatusBody = {
  status: TaskStatus
}

export type PatchTasksIdPriorityBody = {
  priority: Priority
}
