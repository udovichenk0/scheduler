import { createEffect, createEvent, createStore } from "effector"
import { attach, sample } from "effector/effector.umd"

type Options = {
  path: string
  events?: string[]
}

export const createSseClient = (_: Options) => {
  const $conn = createStore<Nullable<EventSource>>(null)
  // const $events = createStore<string[]>([])
  // const receiveMessage = createEvent<{ data: any; event: string }>()
  // const registerEvent = createEvent<string>()
  const closeConn = createEvent()
  const connectFx = createEffect((id: string) => {
    const eventSource = new EventSource(
      `http://localhost:3000/api/sse?id=${id}`,
    )
    return new Promise((_, rej) => {
      eventSource.onmessage = (e) => {
        console.log("got message", e)
      }
      eventSource.addEventListener("error", (_) => {
        rej("something happened")
      })

      eventSource.addEventListener("invite", () => {
        console.log("got invitation")
      })

      // eventSource.addEventListener("message", (e) => {
      //   e.data
      // })
    })
  })

  const closeConnFx = attach({
    source: $conn,
    effect: (conn) => {
      if (conn) {
        conn?.close()
      }
    },
  })

  sample({
    clock: closeConn,
    target: closeConnFx,
  })
  return {
    connectFx,
  }
}

export const invitationSseClient = createSseClient({
  path: "invitation",
  events: ["receive-invitation"],
})
