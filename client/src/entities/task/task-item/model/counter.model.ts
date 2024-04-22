import { not } from "patronum"
import { Query } from "@farfetched/core"
import { Effect, createEvent, createStore, sample } from "effector"

import { TaskType, taskApi, Count } from "@/shared/api/task"
import { $accessToken } from "@/shared/api/token/token.model"
import { authApi } from "@/shared/api/auth"
import { tokenApi } from "@/shared/api/token"

type FilterArguments = {
  start_date: Nullable<Date>
  type: TaskType
}

type ApiQuery = Query<void, Count, unknown>
type ApiLs = Effect<void, { result: Count }>

export const createTaskCounter = ({
  filter,
  api,
}: {
  filter: (args: FilterArguments) => boolean
  api: {
    taskQuery: ApiQuery
    taskLs: ApiLs
  }
}) => {
  const $counter = createStore<number>(0)
  const getCount = createEvent()
  sample({
    clock: [api.taskLs.doneData, api.taskQuery.finished.success],
    fn: ({ result }) => result.count,
    target: $counter,
  })
  sample({
    clock: [
      taskApi.createTaskMutation.finished.success,
      taskApi.createTaskLs.doneData,
    ],
    source: $counter,
    filter: (_, { result }) => filter(result),
    fn: (counter) => counter + 1,
    target: $counter,
  })
  sample({
    clock: [
      taskApi.trashTaskMutation.finished.success,
      taskApi.trashTaskLs.doneData,
    ],
    source: $counter,
    filter: (_, { result }) => filter(result),
    fn: (counter) => counter - 1,
    target: $counter,
  })

  sample({
    clock: [
      taskApi.createTasksMutation.finished.success,
      tokenApi.refreshQuery.finished.success,
    ],
    target: api.taskQuery.start,
  })
  sample({
    clock: getCount,
    filter: not($accessToken),
    target: api.taskLs,
  })

  sample({
    clock: authApi.logoutQuery.finished.success,
    target: $counter.reinit,
  })

  return {
    $counter,
    getCount,
  }
}
