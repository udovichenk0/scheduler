import { EventCallable, createEvent, createEffect, sample } from "effector"
import { v4 } from "uuid"

export const createOptimistic = <Params, Data, T, O>({
  handler,
  mapParams,
  mapOptimistic,
  onOptimistic,
}: {
  handler: (data: Params) => Promise<Data>
  mapParams: (data: T) => Params
  mapOptimistic: (id: string, p: T) => O
  onOptimistic: EventCallable<O>
}) => {
  const start = createEvent<T>()
  const onSuccess = createEvent<{ id: string; data: Data }>()
  const onFail = createEvent<{ id: string; error: Error; params: T }>()

  const fx = createEffect(async ({ params }: { tempId: string; params: T }) => {
    return await handler(mapParams(params))
  })
  const r = createEvent<{ tempId: string; params: T }>()
  sample({
    clock: start,
    fn: (params) => ({ tempId: v4(), params }),
    target: r,
  })

  sample({
    clock: r,
    fn: ({ tempId, params }) => ({ tempId, params }),
    target: fx,
  })

  sample({
    clock: r,
    fn: ({ tempId, params }) => mapOptimistic(tempId, params),
    target: onOptimistic,
  })

  sample({
    clock: fx.done,
    fn: ({ params, result }) => ({ id: params.tempId, data: result }),
    target: onSuccess,
  })

  sample({
    clock: fx.fail,
    fn: ({ params, error }) => ({
      id: params.tempId,
      params: params.params,
      error,
    }),
    target: onFail,
  })

  return {
    start,
    onSuccess,
    onFail,
  }
}
