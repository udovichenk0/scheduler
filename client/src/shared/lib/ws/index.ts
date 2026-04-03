import {
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from "effector"

export const createWsConnection = (path: string) => {
  const wsConnect = createEvent<string>()
  const disconnect = createEvent()
  const messageSent = createEvent<string>()
  const messageReceived = createEvent()
  const $lastMessage = createStore("")

  $lastMessage.on(messageReceived, (_, newMessage) => newMessage)

  const connectWsFx = createEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/api/${path}/ws`)
    const disconnectBind = scopeBind(disconnect)
    const getMessageBind = scopeBind(messageReceived)

    return new Promise<WebSocket>((res, rej) => {
      ws.onopen = () => {
        res(ws)
      }

      ws.onmessage = (msg) => {
        getMessageBind(msg.data)
      }

      ws.onclose = () => {
        disconnectBind()
      }

      ws.onerror = (err) => {
        disconnectBind()
        rej(err)
      }
    })
  })

  const $connection = createStore<Nullable<WebSocket>>(null)
    .on(connectWsFx.doneData, (_, ws) => ws)
    .reset(disconnect)

  const sendMessageFx = createEffect(
    (params: { socket: WebSocket; message: string }) => {
      params.socket.send(params.message)
    },
  )

  sample({
    clock: messageSent,
    source: $connection,
    filter: Boolean,
    fn: (socket, message) => ({
      socket,
      message,
    }),
    target: sendMessageFx,
  })

  sample({
    clock: wsConnect,
    filter: Boolean,
    target: connectWsFx,
  })
  return {
    wsConnect,
    disconnect,
    messageSent,
    messageReceived,
    $lastMessage,
    sendMessageFx,
  }
}
