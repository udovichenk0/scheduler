/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Swagger Scheduler
 * OpenAPI spec version: 1.0.0
 */
import * as zod from "@zod/mini"

/**
 * @summary Check if verified email exists
 */
export const getEmailExistsQueryEmailMin = 4

export const getEmailExistsQueryParams = zod.object({
  email: zod
    .string()
    .check(zod.email(), zod.minLength(getEmailExistsQueryEmailMin)),
})

export const getEmailExistsResponse = zod.object({
  exists: zod.boolean(),
})

/**
 * @summary Sign in a user
 */
export const postAuthSigninBodyEmailMin = 4

export const postAuthSigninBody = zod.object({
  email: zod
    .string()
    .check(zod.email(), zod.minLength(postAuthSigninBodyEmailMin)), //describe
  password: zod.string(),
})

export const postAuthSigninResponseEmailMin = 4

export const postAuthSigninResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  email: zod
    .string()
    .check(zod.email(), zod.minLength(postAuthSigninResponseEmailMin)), //describe
  verified: zod.boolean(),
})

export const postAuthSignupBodyEmailMin = 4

export const postAuthSignupBody = zod.object({
  email: zod
    .string()
    .check(zod.email(), zod.minLength(postAuthSignupBodyEmailMin)), //describe
  password: zod.string(),
})

export const postAuthSignupResponseEmailMin = 4

export const postAuthSignupResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  email: zod
    .string()
    .check(zod.email(), zod.minLength(postAuthSignupResponseEmailMin)), //describe
  verified: zod.boolean(),
})

/**
 * @summary Verify email
 */
export const postAuthVerifyBodyCodeMin = 6

export const postAuthVerifyBodyCodeMax = 6

export const postAuthVerifyBody = zod.object({
  code: zod
    .string()
    .check(
      zod.minLength(postAuthVerifyBodyCodeMin),
      zod.maxLength(postAuthVerifyBodyCodeMax),
    ),
  userId: zod.string().check(zod.uuid()),
})

/**
 * @summary Check user`s session
 */
export const getAuthSessionResponseEmailMin = 4

export const getAuthSessionResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  email: zod
    .string()
    .check(zod.email(), zod.minLength(getAuthSessionResponseEmailMin)), //describe
  verified: zod.boolean(),
})

/**
 * @summary Resend verification code
 */
export const postAuthResendBodyEmailMin = 4

export const postAuthResendBody = zod.object({
  email: zod
    .string()
    .check(zod.email(), zod.minLength(postAuthResendBodyEmailMin)), //describe
  userId: zod.string().check(zod.uuid()),
})

export const getTasksResponseItem = zod.object({
  id: zod.string().check(zod.uuid()),
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  user_id: zod.string().check(zod.uuid()),
  type: zod.enum(["inbox", "unplaced"]),
  date_created: zod.string(),
  is_trashed: zod.boolean(),
})
export const getTasksResponse = zod.array(getTasksResponseItem)

/**
 * @summary Create task
 */
export const postTasksBody = zod.object({
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  type: zod.enum(["inbox", "unplaced"]),
})

export const postTasksResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  user_id: zod.string().check(zod.uuid()),
  type: zod.enum(["inbox", "unplaced"]),
  date_created: zod.string(),
  is_trashed: zod.boolean(),
})

/**
 * @summary Update task's fields
 */
export const putTasksIdParams = zod.object({
  id: zod.string().check(zod.uuid()),
})

export const putTasksIdBody = zod.object({
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  type: zod.enum(["inbox", "unplaced"]),
})

export const putTasksIdResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  user_id: zod.string().check(zod.uuid()),
  type: zod.enum(["inbox", "unplaced"]),
  date_created: zod.string(),
  is_trashed: zod.boolean(),
})

/**
 * @summary Delete trashed task by taskId
 */
export const deleteTasksIdParams = zod.object({
  id: zod.string().check(zod.uuid()),
})

/**
 * @summary Update task's date
 */
export const patchTasksIdDateParams = zod.object({
  id: zod.string().check(zod.uuid()),
})

export const patchTasksIdDateBody = zod.object({
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
})

export const patchTasksIdDateResponse = zod.object({
  id: zod.string().check(zod.uuid()),
  title: zod.string(),
  description: zod.nullable(zod.string()),
  status: zod.enum(["inprogress", "finished"]),
  start_date: zod.nullable(zod.number()),
  due_date: zod.nullable(zod.number()),
  user_id: zod.string().check(zod.uuid()),
  type: zod.enum(["inbox", "unplaced"]),
  date_created: zod.string(),
  is_trashed: zod.boolean(),
})

export const patchTasksIdStatusParams = zod.object({
  id: zod.string().check(zod.uuid()),
})

export const patchTasksIdStatusBody = zod.object({
  status: zod.enum(["inprogress", "finished"]),
})

export const postTasksIdTrashParams = zod.object({
  id: zod.string().check(zod.uuid()),
})
