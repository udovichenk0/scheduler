import { Timer } from "./config"
let timer: NodeJS.Timeout

onmessage = function (e) {
  switch (e.data.command) {
    case Timer.START:
      timer = setInterval(() => {
        self.postMessage({ isRunning: true })
      }, 10)
      break
    case Timer.STOP:
      clearInterval(timer)
      self.postMessage({ isRunning: false })
      break
  }
}
